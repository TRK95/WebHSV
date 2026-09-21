import express from "express";
import Multer from "multer";
import asyncHandler from "../../utils/asyncHandler";
import { formatDateYMD, getRandomInt } from "../../utils";
import dotenv from "../../utils/dotenv";
import { getPublicObjectUrl, uploadObject } from "../../services/storageService";

dotenv.config();

const Router = express.Router();

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

const BASE_FORDER = process.env.STORAGE_BASE_FOLDER || process.env.R2_BASE_FOLDER || process.env.GCLOUD_STORAGE_BASE_FOLDER;

const uploadFile = async (file: any, _baseFolder = BASE_FORDER): Promise<string> => {
  const { originalname, buffer } = file;
  const fileName = `${formatDateYMD()}/${getRandomInt(
    99999999
  )}${originalname.substring(
    originalname.lastIndexOf("."),
    originalname.length
  )}`;
  const baseFolder = _baseFolder
    ? (_baseFolder.endsWith("/") ? _baseFolder : `${_baseFolder}/`)
    : "";
  const objectName = `${baseFolder}${fileName}`;
  await uploadObject({
    objectName,
    buffer,
    contentType: file.mimetype,
    contentDisposition: "attachment",
    publicRead: true,
  });
  return getPublicObjectUrl(objectName);
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
