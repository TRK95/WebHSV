import express from "express";
import { Storage } from "@google-cloud/storage";
import Multer from "multer";
import asyncHandler from "../../utils/asyncHandler";
import { formatDateYMD, getRandomInt } from "../../utils";
import dotenv from "../../utils/dotenv";

dotenv.config();

const Router = express.Router();

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

const storage = new Storage({
  projectId: process.env.GCLOUD_STORAGE_PROJECT_ID,
  credentials: {
    type: "service_account",
    private_key: process.env.GCLOUD_STORAGE_PRIVATE_KEY,
    client_id: process.env.GCLOUD_STORAGE_CLIENT_ID,
    client_email: process.env.GCLOUD_STORAGE_CLIENT_EMAIL,
  },
});

const BUCKET_NAME = process.env.GCLOUD_STORAGE_BUCKET;
const BASE_FORDER = process.env.GCLOUD_STORAGE_BASE_FOLDER;

const uploadFile = (file: any, _baseFolder = BASE_FORDER): Promise<string> => {
  const bucket = storage.bucket(BUCKET_NAME || "");
  return new Promise((resolve, reject) => {
    const { originalname, buffer } = file;
    const fileName = `${formatDateYMD()}/${getRandomInt(
      99999999
    )}${originalname.substring(
      originalname.lastIndexOf("."),
      originalname.length
    )}`;
    const baseFolder = _baseFolder?.endsWith("/")
      ? _baseFolder
      : `${_baseFolder}/`;
    const blob = bucket.file(baseFolder + fileName);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        contentDisposition: "attachment",
        metadata: {
          originalBytes: file.size,
        },
      },
      resumable: false, // disable resumable for file size < 10MB.
    });

    blobStream
      .on("finish", async () => {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      })
      .on("error", (err) => {
        reject(new Error(`Unable to upload file, something went wrong ${err}`));
      })
      .end(buffer);
  });
};

Router.post(
  "/upload-file",
  multer.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).end("No file uploaded.");
    }
    const baseFolder =
      req.query.baseFolder || req.body.baseFolder
        ? ((req.query.baseFolder || req.body.baseFolder) as string)
        : undefined;
    const dataRes = await uploadFile(req.file, baseFolder);
    return res.status(200).send(dataRes);
  })
);

export { Router as uploadRouters };
