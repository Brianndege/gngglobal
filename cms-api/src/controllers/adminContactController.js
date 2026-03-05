import sanitizeHtml from "sanitize-html";
import { prisma } from "../config/prisma.js";
import { serializeContactMessage } from "../utils/serializers.js";
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

    const where = status ? { status } : {};

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contactMessage.count({ where }),
    ]);

    return res.json({
      messages: messages.map(serializeContactMessage),
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
    const message = await prisma.contactMessage.findUnique({
      where: { id: req.params.id },
    });

    if (!message) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    const requestedStatus = String(req.body.status || "").trim();
    if (requestedStatus !== "new" && requestedStatus !== "responded") {
      return res.status(400).json({ message: "Status must be either 'new' or 'responded'" });
    }

    const responseNotes = sanitizePlainText(req.body.responseNotes || "");

    const updated = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: {
        status: requestedStatus,
        responseNotes,
        respondedAt: requestedStatus === "responded" ? new Date() : null,
      },
    });

    return res.json({ message: serializeContactMessage(updated) });
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
