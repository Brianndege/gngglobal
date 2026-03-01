import fs from "node:fs";
import path from "node:path";
import multer from "multer";

const uploadDir = path.resolve(process.cwd(), "uploads", "posts");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const cleanName = file.originalname.replace(/\s+/g, "-").toLowerCase();
    cb(null, `${suffix}-${cleanName}`);
  },
});

const allowedMime = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

function fileFilter(_req, file, cb) {
  if (!allowedMime.has(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, WEBP, and AVIF files are allowed"));
  }

  return cb(null, true);
}

export const uploadFeaturedImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
