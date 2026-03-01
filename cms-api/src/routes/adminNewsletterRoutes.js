import { Router } from "express";
import { exportAdminNewsletterCsv, getAdminNewsletterSubscribers } from "../controllers/adminNewsletterController.js";
import { requireAdminAuth } from "../middleware/auth.js";

const router = Router();

router.use("/admin", requireAdminAuth);
router.get("/admin/newsletter", getAdminNewsletterSubscribers);
router.get("/admin/newsletter/export.csv", exportAdminNewsletterCsv);

export default router;
