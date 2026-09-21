import crypto from "crypto";
import fetch from "node-fetch";
import { Storage } from "@google-cloud/storage";

type UploadArgs = {
  objectName: string;
  buffer: Buffer;
  contentType?: string;
  contentDisposition?: string;
  publicRead?: boolean;
};

const provider = () => String(process.env.STORAGE_PROVIDER || (process.env.R2_BUCKET ? "r2" : "gcs")).toLowerCase();

const gcsStorage = () => new Storage({
  projectId: process.env.GCLOUD_STORAGE_PROJECT_ID,
  credentials: {
    type: "service_account",
    private_key: process.env.GCLOUD_STORAGE_PRIVATE_KEY,
    client_id: process.env.GCLOUD_STORAGE_CLIENT_ID,
    client_email: process.env.GCLOUD_STORAGE_CLIENT_EMAIL,
  },
});

const getGcsBucket = () => gcsStorage().bucket(process.env.GCLOUD_STORAGE_BUCKET || "");

const getR2Config = () => {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error("Missing Cloudflare R2 configuration");
  }
  const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
  return { accountId, accessKeyId, secretAccessKey, bucket, endpoint, region: "auto", service: "s3" };
};

const sha256Hex = (value: crypto.BinaryLike) => crypto.createHash("sha256").update(value).digest("hex");
const hmac = (key: crypto.BinaryLike, value: string) => crypto.createHmac("sha256", key).update(value).digest();
const rfc3986 = (value: string) => encodeURIComponent(value).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
const encodePath = (path: string) => path.split("/").map(rfc3986).join("/");

const signingKey = (secretAccessKey: string, dateStamp: string, region: string, service: string) => {
  const dateKey = hmac(`AWS4${secretAccessKey}`, dateStamp);
  const regionKey = hmac(dateKey, region);
  const serviceKey = hmac(regionKey, service);
  return hmac(serviceKey, "aws4_request");
};

const amzDates = (now = new Date()) => {
  const iso = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  return { amzDate: iso, dateStamp: iso.slice(0, 8) };
};

const uploadR2Object = async (args: UploadArgs) => {
  const config = getR2Config();
  const { amzDate, dateStamp } = amzDates();
  const payloadHash = sha256Hex(args.buffer);
  const host = `${config.accountId}.r2.cloudflarestorage.com`;
  const canonicalUri = `/${config.bucket}/${encodePath(args.objectName)}`;
  const headers: Record<string, string> = {
    "content-type": args.contentType || "application/octet-stream",
    host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };
  if (args.contentDisposition) headers["content-disposition"] = args.contentDisposition;

  const signedHeaders = Object.keys(headers).sort().join(";");
  const canonicalHeaders = Object.keys(headers).sort().map((key) => `${key}:${headers[key]}\n`).join("");
  const canonicalRequest = [
    "PUT",
    canonicalUri,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");
  const credentialScope = `${dateStamp}/${config.region}/${config.service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");
  const signature = crypto.createHmac("sha256", signingKey(config.secretAccessKey, dateStamp, config.region, config.service)).update(stringToSign).digest("hex");
  const authorization = `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(`${config.endpoint}${canonicalUri}`, {
    method: "PUT",
    headers: {
      ...headers,
      Authorization: authorization,
    },
    body: args.buffer,
  });
  if (!res.ok) throw new Error(`Unable to upload R2 object: ${res.status} ${await res.text()}`);
};

const getR2SignedUrl = (objectName: string, expiresSeconds: number) => {
  const config = getR2Config();
  const { amzDate, dateStamp } = amzDates();
  const host = `${config.accountId}.r2.cloudflarestorage.com`;
  const canonicalUri = `/${config.bucket}/${encodePath(objectName)}`;
  const credentialScope = `${dateStamp}/${config.region}/${config.service}/aws4_request`;
  const query: Record<string, string> = {
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${config.accessKeyId}/${credentialScope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": String(expiresSeconds),
    "X-Amz-SignedHeaders": "host",
  };
  const canonicalQuery = Object.keys(query).sort().map((key) => `${rfc3986(key)}=${rfc3986(query[key])}`).join("&");
  const canonicalRequest = [
    "GET",
    canonicalUri,
    canonicalQuery,
    `host:${host}\n`,
    "host",
    "UNSIGNED-PAYLOAD",
  ].join("\n");
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");
  const signature = crypto.createHmac("sha256", signingKey(config.secretAccessKey, dateStamp, config.region, config.service)).update(stringToSign).digest("hex");
  return `${config.endpoint}${canonicalUri}?${canonicalQuery}&X-Amz-Signature=${signature}`;
};

export const uploadObject = async (args: UploadArgs) => {
  if (provider() === "r2") {
    await uploadR2Object(args);
    return args.objectName;
  }

  const blob = getGcsBucket().file(args.objectName);
  await blob.save(args.buffer, {
    resumable: false,
    metadata: {
      contentType: args.contentType,
      contentDisposition: args.contentDisposition,
    },
  });
  if (args.publicRead) await blob.makePublic();
  return args.objectName;
};

export const getSignedObjectUrl = async (objectName?: string, expiresMs = 15 * 60 * 1000) => {
  if (!objectName) return "";
  if (provider() === "r2") return getR2SignedUrl(objectName, Math.ceil(expiresMs / 1000));
  const [url] = await getGcsBucket().file(objectName).getSignedUrl({
    action: "read",
    expires: Date.now() + expiresMs,
  });
  return url;
};

export const getPublicObjectUrl = (objectName: string) => {
  if (provider() === "r2") {
    const publicBase = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "");
    return publicBase ? `${publicBase}/${objectName}` : objectName;
  }
  return `https://storage.googleapis.com/${process.env.GCLOUD_STORAGE_BUCKET}/${objectName}`;
};
