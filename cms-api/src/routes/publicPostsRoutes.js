import { Router } from "express";
import { getPublishedPostBySlug, getPublishedPosts } from "../controllers/publicPostsController.js";

const router = Router();

router.get("/posts", getPublishedPosts);
router.get("/posts/:slug", getPublishedPostBySlug);

export default router;
