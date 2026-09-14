

import path from "path"
import fs from "fs"
import express from "express";
import Multer from "multer";
import asyncHandler from "../../utils/asyncHandler";
import dotenv from "../../utils/dotenv";

dotenv.config();
const Router = express.Router();

const storage = Multer.diskStorage({
  destination: (req, file, cb) => {
    const baseFolder = req.query.baseFolder as string;
    const currentTime = new Date()
    const destinationFolder = path.join(__dirname, '../../', 'images', baseFolder || '', `${currentTime.getFullYear()}`, `${currentTime.getMonth() + 1}`, `${currentTime.getDate()}`);

    fs.exists(destinationFolder, (exists) => {
      if (!exists) {
        fs.mkdir(destinationFolder, { recursive: true }, (err) => {
          if (err) {
            console.error('Lỗi khi tạo thư mục:', err);
          } else {
            cb(null, destinationFolder);
          }
        });
      } else {
        cb(null, destinationFolder);
      }
    });
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});
const storageFolder = Multer.diskStorage({
  destination: (req, file, cb) => {
    const baseFolder = req.query.baseFolder as string;
    const destinationFolder = path.join(__dirname, '../../', 'images', baseFolder || '');

    fs.exists(destinationFolder, (exists) => {
      if (!exists) {
        fs.mkdir(destinationFolder, { recursive: true }, (err) => {
          if (err) {
            console.error('Lỗi khi tạo thư mục:', err);
          } else {
            cb(null, destinationFolder);
          }
        });
      } else {
        cb(null, destinationFolder);
      }
    });
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});


const uploadImage = Multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG and PNG image types are allowed'));
    }
  },
});

const uploadFile = Multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG and PNG image types are allowed'));
    }
  },
});


const uploadFolder = Multer({
  storage: storageFolder,
  limits: {
    fileSize: 500 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.zip', '.rar'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only .zip and .rar file types are allowed'));
    }
  },
});

Router.post(
  "/upload-static-image",
  uploadImage.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    const baseFolder = req.query.baseFolder
    const currentTime = new Date()
    const imageUrl = `${process.env.URL_SERVER}/images/${baseFolder}/${currentTime.getFullYear()}/${currentTime.getMonth() + 1}/${currentTime.getDate()}/${req.file.filename}`;
    return res.status(200).send(imageUrl);
  })
);

Router.post(
  "/upload-static-file",
  uploadFile.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const baseFolder = req.query.baseFolder
    const currentTime = new Date()
    const fileUrl = `${process.env.URL_SERVER}/images/${baseFolder}/${currentTime.getFullYear()}/${currentTime.getMonth() + 1}/${currentTime.getDate()}/${req.file.filename}`;
    return res.status(200).send(fileUrl);
  })
);

Router.post(
  "/upload-static-folder",
  uploadFolder.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const baseFolder = req.query.baseFolder
    const folderUrl = `${process.env.URL_SERVER}/images/${baseFolder}/${req.file.filename}`;
    return res.status(200).send(folderUrl);
  })
);

export { Router as uploadStaticRouters };
