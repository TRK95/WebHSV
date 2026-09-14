import express from "express";
import Multer from "multer";
import { Storage } from "@google-cloud/storage";
import { verify } from "jsonwebtoken";
import { jwtCmsHSV } from "../../constraint";
import asyncHandler from "../../utils/asyncHandler";
import dotenv from "../../utils/dotenv";
import Sv5tService from "../../services/sv5tService";

dotenv.config();
const Router = express.Router();
const service = new Sv5tService();
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
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
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET || "");

const safeName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, "_");
const uploadPrivateEvidence = async (file: any, studentId: string) => {
  const objectName = `sv5t/evidence/${studentId}/${Date.now()}_${safeName(file.originalname || "evidence.pdf")}`;
  const blob = bucket.file(objectName);
  await blob.save(file.buffer, {
    resumable: false,
    metadata: {
      contentType: "application/pdf",
      contentDisposition: `attachment; filename="${safeName(file.originalname || "evidence.pdf")}"`,
    },
  });
  return objectName;
};

const getSignedEvidenceUrl = async (objectName?: string) => {
  if (!objectName) return "";
  const [url] = await bucket.file(objectName).getSignedUrl({
    action: "read",
    expires: Date.now() + 15 * 60 * 1000,
  });
  return url;
};

const getStudentFromRequest = (req: any): { studentId: string; fullName: string } | null => {
  const auth = String(req.headers.authorization || "");
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : (req.body?.token || req.query?.token);
  if (!token) return null;
  try {
    const decoded: any = verify(token, jwtCmsHSV);
    const info = decoded?.userClubs?.userInfo;
    const studentId = String(info?.userId ?? decoded?.userClubs?.userId ?? "").trim();
    if (!studentId) return null;
    return { studentId, fullName: String(info?.fullName ?? "") };
  } catch (_) {
    return null;
  }
};

const parseCsv = (text: string) => {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  if (!lines.length) return [];

  const firstLine = lines[0];
  const delimiter = (firstLine.match(/;/g)?.length || 0) > (firstLine.match(/,/g)?.length || 0) ? ";" : ",";

  const splitLine = (line: string) => {
    const out: string[] = [];
    let current = "";
    let quoted = false;
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (ch === '"') {
        if (quoted && line[i + 1] === '"') { current += '"'; i += 1; }
        else quoted = !quoted;
      } else if (ch === delimiter && !quoted) {
        out.push(current.trim()); current = "";
      } else current += ch;
    }
    out.push(current.trim());
    return out;
  };

  const normalizeHeader = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
  const headers = splitLine(lines[0]).map(normalizeHeader);
  const studentAliases = ["mssv", "masinhvien", "studentid", "studentcode", "msv"];
  const nameAliases = ["hoten", "hovaten", "fullname", "name", "tensinhvien"];
  const studentIdx = headers.findIndex((h) => studentAliases.includes(h));
  const nameIdx = headers.findIndex((h) => nameAliases.includes(h));
  if (studentIdx < 0) return [];

  return lines.slice(1).map(splitLine).map((cols) => ({
    studentId: String(cols[studentIdx] ?? "").trim(),
    fullName: nameIdx >= 0 ? String(cols[nameIdx] ?? "").trim() : "",
  })).filter((row) => row.studentId);
};

// Admin/CMS endpoints. They follow the existing CMS access pattern in this project.
Router.get("/sv5t/campaigns", asyncHandler(async (_req, res) => res.status(200).json(await service.listCampaigns())));
Router.post("/sv5t/campaigns/upsert", asyncHandler(async (req, res) => res.status(200).json(await service.upsertCampaign(req.body))));
Router.get("/sv5t/activities", asyncHandler(async (req, res) => res.status(200).json(await service.listActivities(String(req.query.campaignId || "")))));
Router.post("/sv5t/activities", asyncHandler(async (req, res) => res.status(200).json(await service.createActivity(req.body))));
Router.post("/sv5t/activities/update", asyncHandler(async (req, res) => res.status(200).json(await service.updateActivity(req.body))));
Router.post("/sv5t/activities/:activityId/import-csv", multer.single("file"), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ data: null, status: -1, message: "CSV file is required" });
  const rows = parseCsv(req.file.buffer.toString("utf8"));
  if (!rows.length) return res.status(400).json({ data: null, status: -1, message: "CSV must contain MSSV/studentId column" });
  return res.status(200).json(await service.importParticipants(req.params.activityId, rows));
}));
Router.get("/sv5t/claims", asyncHandler(async (req, res) => {
  const result: any = await service.listClaims({
    campaignId: String(req.query.campaignId || ""),
    status: req.query.status === undefined ? undefined : Number(req.query.status),
    limit: req.query.limit ? Number(req.query.limit) : 50,
    offset: req.query.offset ? Number(req.query.offset) : 0,
  });
  result.data = await Promise.all(result.data.map(async (item: any) => {
    const obj = item.toObject ? item.toObject() : item;
    return { ...obj, evidenceUrl: await getSignedEvidenceUrl(obj.evidenceObject) };
  }));
  return res.status(200).json(result);
}));
Router.post("/sv5t/claims/:claimId/review", asyncHandler(async (req, res) => res.status(200).json(await service.reviewClaim({
  claimId: req.params.claimId,
  status: Number(req.body.status),
  adminNote: req.body.adminNote,
  criterionKey: req.body.criterionKey,
}))));
Router.get("/sv5t/applications", asyncHandler(async (req, res) => res.status(200).json(await service.listApplications({
  campaignId: String(req.query.campaignId || ""),
  limit: req.query.limit ? Number(req.query.limit) : 50,
  offset: req.query.offset ? Number(req.query.offset) : 0,
}))));

// Student endpoints require the login JWT already used by the Web app.
Router.get("/sv5t/student/dashboard", asyncHandler(async (req, res) => {
  const student = getStudentFromRequest(req);
  if (!student) return res.status(401).json({ data: null, status: -1, message: "Unauthorized" });
  const result: any = await service.getStudentDashboard(student.studentId);
  if (result.data?.claims) {
    result.data.claims = await Promise.all(result.data.claims.map(async (item: any) => {
      const obj = item.toObject ? item.toObject() : item;
      return { ...obj, evidenceUrl: await getSignedEvidenceUrl(obj.evidenceObject) };
    }));
  }
  return res.status(200).json(result);
}));

Router.post("/sv5t/student/evidence", multer.single("file"), asyncHandler(async (req, res) => {
  const student = getStudentFromRequest(req);
  if (!student) return res.status(401).json({ data: null, status: -1, message: "Unauthorized" });
  if (!req.file) return res.status(400).json({ data: null, status: -1, message: "PDF file is required" });
  if (req.file.mimetype !== "application/pdf" && !req.file.originalname.toLowerCase().endsWith(".pdf")) {
    return res.status(400).json({ data: null, status: -1, message: "Only PDF is allowed" });
  }
  const evidenceObject = await uploadPrivateEvidence(req.file, student.studentId);
  return res.status(200).json({ data: { evidenceObject }, status: 0 });
}));

Router.post("/sv5t/student/claims", asyncHandler(async (req, res) => {
  const student = getStudentFromRequest(req);
  if (!student) return res.status(401).json({ data: null, status: -1, message: "Unauthorized" });
  const result = await service.createClaim({
    ...req.body,
    studentId: student.studentId,
    fullName: student.fullName,
  });
  return res.status(200).json(result);
}));

Router.post("/sv5t/student/submit", asyncHandler(async (req, res) => {
  const student = getStudentFromRequest(req);
  if (!student) return res.status(401).json({ data: null, status: -1, message: "Unauthorized" });
  const result = await service.submitApplication(String(req.body.campaignId || ""), student.studentId, student.fullName);
  return res.status(200).json(result);
}));

export { Router as sv5tRouters };
