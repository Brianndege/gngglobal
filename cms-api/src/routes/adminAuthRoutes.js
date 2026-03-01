import { Router } from "express";
import { adminLogin } from "../controllers/adminAuthController.js";

const router = Router();

router.post("/admin/login", adminLogin);

export default router;
