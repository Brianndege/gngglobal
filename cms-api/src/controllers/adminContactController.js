import sanitizeHtml from "sanitize-html";
import { ContactMessage } from "../models/ContactMessage.js";
import { sendContactNotificationTest } from "../utils/contactNotifier.js";

function sanitizePlainText(value) {
  return sanitizeHtml(String(value || ""), {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

export async function getAdminContactMessages(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 200);
    const status = req.query.status && req.query.status !== "all" ? String(req.query.status) : null;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const [messages, total] = await Promise.all([
      ContactMessage.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ContactMessage.countDocuments(filter),
    ]);

    return res.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminContactMessage(req, res, next) {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    const requestedStatus = String(req.body.status || "").trim();
    if (requestedStatus !== "new" && requestedStatus !== "responded") {
      return res.status(400).json({ message: "Status must be either 'new' or 'responded'" });
    }

    const responseNotes = sanitizePlainText(req.body.responseNotes || "");

    message.status = requestedStatus;
    message.responseNotes = responseNotes;
    message.respondedAt = requestedStatus === "responded" ? new Date() : null;

    await message.save();

    return res.json({ message });
  } catch (error) {
    return next(error);
  }
}

export async function sendAdminContactNotificationTest(req, res, next) {
  try {
    await sendContactNotificationTest();
    return res.status(200).json({ message: "Test notification email sent" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

    return next(error);
  }
}
