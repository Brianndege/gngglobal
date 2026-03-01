import { NewsletterSubscriber } from "../models/NewsletterSubscriber.js";

function escapeCsv(value) {
  const stringValue = String(value ?? "");
  if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getAdminNewsletterSubscribers(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
    const status = req.query.status && req.query.status !== "all" ? req.query.status : null;
    const query = String(req.query.q || "").trim();

    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (query) {
      filter.email = { $regex: escapeRegex(query), $options: "i" };
    }

    const [subscribers, total] = await Promise.all([
      NewsletterSubscriber.find(filter)
        .sort({ subscribedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      NewsletterSubscriber.countDocuments(filter),
    ]);

    return res.json({
      subscribers,
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

    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (query) {
      filter.email = { $regex: escapeRegex(query), $options: "i" };
    }

    const subscribers = await NewsletterSubscriber.find(filter)
      .sort({ subscribedAt: -1, createdAt: -1 })
      .lean();

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
