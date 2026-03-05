import "dotenv/config";
import path from "node:path";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "node:url";
import { connectDb, getDbStatus } from "./config/db.js";
import publicPostsRoutes from "./routes/publicPostsRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminPostsRoutes from "./routes/adminPostsRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import adminNewsletterRoutes from "./routes/adminNewsletterRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminContactRoutes from "./routes/adminContactRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();
const port = Number(process.env.PORT || 8080);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.resolve(__dirname, "..", "uploads");

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsPath));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", db: getDbStatus() });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", db: getDbStatus() });
});

app.use("/api", publicPostsRoutes);
app.use("/api", adminAuthRoutes);
app.use("/api", adminPostsRoutes);
app.use("/api", newsletterRoutes);
app.use("/api", adminNewsletterRoutes);
app.use("/api", contactRoutes);
app.use("/api", adminContactRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`CMS API running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database", error);
    process.exit(1);
  });
