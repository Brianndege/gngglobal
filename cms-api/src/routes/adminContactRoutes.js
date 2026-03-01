import { Router } from "express";
import {
	getAdminContactMessages,
	sendAdminContactNotificationTest,
	updateAdminContactMessage,
} from "../controllers/adminContactController.js";
import { requireAdminAuth } from "../middleware/auth.js";

const router = Router();

router.use("/admin", requireAdminAuth);
router.get("/admin/contact-messages", getAdminContactMessages);
router.patch("/admin/contact-messages/:id", updateAdminContactMessage);
router.post("/admin/contact-messages/test-notification", sendAdminContactNotificationTest);

export default router;
