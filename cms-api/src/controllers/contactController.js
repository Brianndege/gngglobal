import sanitizeHtml from "sanitize-html";
import { prisma } from "../config/prisma.js";
import { serializeContactMessage } from "../utils/serializers.js";
import { notifyNewContactMessage } from "../utils/contactNotifier.js";

function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function sanitizePlainText(value) {
  return sanitizeHtml(String(value || ""), {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

export async function createContactMessage(req, res, next) {
  try {
    const { name, email, phone, company, message, website } = req.body;

    if (website) {
      return res.status(200).json({ message: "Message sent successfully" });
    }

    const safeName = sanitizePlainText(name);
    const safeEmail = sanitizePlainText(email).toLowerCase();
    const safePhone = sanitizePlainText(phone);
    const safeCompany = sanitizePlainText(company);
    const safeMessage = sanitizePlainText(message);

    if (!safeName) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!safeEmail || !isValidEmail(safeEmail)) {
      return res.status(400).json({ message: "A valid email address is required" });
    }

    if (!safeMessage || safeMessage.length < 20) {
      return res.status(400).json({ message: "Message must be at least 20 characters" });
    }

    const createdMessage = await prisma.contactMessage.create({
      data: {
        name: safeName,
        email: safeEmail,
        phone: safePhone,
        company: safeCompany,
        message: safeMessage,
        source: "contact-page",
        status: "new",
      },
    });

    await notifyNewContactMessage(serializeContactMessage(createdMessage));

    return res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    return next(error);
  }
}
