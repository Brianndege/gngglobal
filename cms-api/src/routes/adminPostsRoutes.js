import { Router } from "express";
import {
  createAdminPost,
  deleteAdminPost,
  getAdminPostById,
  getAdminPosts,
  updateAdminPost,
} from "../controllers/adminPostsController.js";
import { requireAdminAuth } from "../middleware/auth.js";
import { uploadFeaturedImage } from "../utils/uploads.js";

const router = Router();

router.use("/admin", requireAdminAuth);
router.get("/admin/posts", getAdminPosts);
router.get("/admin/posts/:id", getAdminPostById);
router.post("/admin/posts", uploadFeaturedImage.single("featuredImage"), createAdminPost);
router.put("/admin/posts/:id", uploadFeaturedImage.single("featuredImage"), updateAdminPost);
router.delete("/admin/posts/:id", deleteAdminPost);

export default router;
