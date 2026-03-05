import { prisma } from "../config/prisma.js";
import { serializeNewsletterSubscriber } from "../utils/serializers.js";

function escapeCsv(value) {
  const stringValue = String(value ?? "");
  if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export async function getAdminNewsletterSubscribers(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
    const status = req.query.status && req.query.status !== "all" ? req.query.status : null;
    const query = String(req.query.q || "").trim();

    const where = {
      ...(status ? { status } : {}),
      ...(query ? { email: { contains: query, mode: "insensitive" } } : {}),
    };

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy: [{ subscribedAt: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.newsletterSubscriber.count({ where }),
    ]);

    return res.json({
      subscribers: subscribers.map(serializeNewsletterSubscriber),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function exportAdminNewsletterCsv(req, res, next) {
  try {
    const status = req.query.status && req.query.status !== "all" ? req.query.status : null;
    const query = String(req.query.q || "").trim();

    const where = {
      ...(status ? { status } : {}),
      ...(query ? { email: { contains: query, mode: "insensitive" } } : {}),
    };

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where,
      orderBy: [{ subscribedAt: "desc" }, { createdAt: "desc" }],
    });

    const headers = ["email", "status", "consent", "source", "subscribedAt", "createdAt", "updatedAt"];
    const rows = subscribers.map((subscriber) => [
      escapeCsv(subscriber.email),
      escapeCsv(subscriber.status),
      escapeCsv(subscriber.consent),
      escapeCsv(subscriber.source),
      escapeCsv(subscriber.subscribedAt),
      escapeCsv(subscriber.createdAt),
      escapeCsv(subscriber.updatedAt),
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="newsletter-subscribers-${Date.now()}.csv"`);

    return res.status(200).send(csv);
  } catch (error) {
    return next(error);
  }
}
