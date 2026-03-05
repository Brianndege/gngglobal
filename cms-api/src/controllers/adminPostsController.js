import sanitizeHtml from "sanitize-html";
import { prisma } from "../config/prisma.js";
import { serializePost } from "../utils/serializers.js";
import { slugify } from "../utils/slugify.js";

function sanitizeContent(content) {
  return sanitizeHtml(content || "", {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3", "blockquote"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}

function resolveImageUrl(req, file) {
  if (!file) {
    return undefined;
  }

  const base = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
  return `${base}/uploads/posts/${file.filename}`;
}

function parseStatus(status) {
  return status === "published" ? "published" : "draft";
}

function parseDate(value) {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function parseBoolean(value) {
  return String(value || "false") === "true";
}

function parseSocialChannels(payload, fallback) {
  return {
    facebook: payload.facebook !== undefined ? parseBoolean(payload.facebook) : Boolean(fallback?.facebook),
    instagram: payload.instagram !== undefined ? parseBoolean(payload.instagram) : Boolean(fallback?.instagram),
    linkedin: payload.linkedin !== undefined ? parseBoolean(payload.linkedin) : Boolean(fallback?.linkedin),
    twitter: payload.twitter !== undefined ? parseBoolean(payload.twitter) : Boolean(fallback?.twitter),
  };
}

async function ensureUniqueSlug(slug, ignoreId) {
  const existing = await prisma.post.findFirst({
    where: {
      slug,
      ...(ignoreId ? { id: { not: ignoreId } } : {}),
    },
    select: { id: true },
  });

  if (!existing) {
    return slug;
  }

  return `${slug}-${Date.now()}`;
}

function validatePayload(payload, hasIncomingImage, hasExistingImage) {
  const errors = [];
  if (!payload.title || !String(payload.title).trim()) {
    errors.push("Title is required");
  }

  if (!payload.content || !String(payload.content).trim()) {
    errors.push("Content is required");
  }

  const hasImage = hasIncomingImage || hasExistingImage;
  if (hasImage && (!payload.featuredImageAlt || !String(payload.featuredImageAlt).trim())) {
    errors.push("Featured image alt text is required when an image is provided");
  }

  return errors;
}

export async function getAdminPosts(req, res, next) {
  try {
    const posts = await prisma.post.findMany({ orderBy: { updatedAt: "desc" } });
    return res.json({ posts: posts.map(serializePost) });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminPostById(req, res, next) {
  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.id } });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json({ post: serializePost(post) });
  } catch (error) {
    return next(error);
  }
}

export async function createAdminPost(req, res, next) {
  try {
    const payload = req.body;
    const status = parseStatus(payload.status);
    const rawSlug = payload.slug ? slugify(payload.slug) : slugify(payload.title || "");

    const imageUrl = resolveImageUrl(req, req.file);
    const errors = validatePayload(payload, Boolean(imageUrl), false);

    if (!rawSlug) {
      errors.push("Slug is required");
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const slug = await ensureUniqueSlug(rawSlug);

    const socialChannels = parseSocialChannels(payload);

    const post = await prisma.post.create({
      data: {
        title: String(payload.title).trim(),
        subheading: payload.subheading?.trim() || "",
        slug,
        category: payload.category?.trim() || "General",
        featuredImageUrl: imageUrl || null,
        featuredImageAlt: imageUrl ? String(payload.featuredImageAlt).trim() : null,
        content: sanitizeContent(payload.content),
        metaTitle: payload.metaTitle?.trim() || "",
        metaDescription: payload.metaDescription?.trim() || "",
        socialFacebook: socialChannels.facebook,
        socialInstagram: socialChannels.instagram,
        socialLinkedin: socialChannels.linkedin,
        socialTwitter: socialChannels.twitter,
        status,
        publishDate: parseDate(payload.publishDate) || null,
        publishedAt: status === "published" ? parseDate(payload.publishDate) || new Date() : null,
      },
    });

    return res.status(201).json({ post: serializePost(post) });
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminPost(req, res, next) {
  try {
    const existing = await prisma.post.findUnique({ where: { id: req.params.id } });

    if (!existing) {
      return res.status(404).json({ message: "Post not found" });
    }

    const payload = req.body;
    const status = parseStatus(payload.status || existing.status);
    const imageUrl = resolveImageUrl(req, req.file);
    const shouldDeleteImage = String(payload.removeFeaturedImage || "false") === "true";

    const rawSlug = payload.slug ? slugify(payload.slug) : slugify(payload.title || existing.title);
    const errors = validatePayload(
      { ...existing, ...payload },
      Boolean(imageUrl),
      !shouldDeleteImage && Boolean(existing.featuredImageUrl)
    );

    if (!rawSlug) {
      errors.push("Slug is required");
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const slug = await ensureUniqueSlug(rawSlug, existing.id);
    const socialChannels = parseSocialChannels(payload, {
      facebook: existing.socialFacebook,
      instagram: existing.socialInstagram,
      linkedin: existing.socialLinkedin,
      twitter: existing.socialTwitter,
    });

    const nextPublishDate = parseDate(payload.publishDate) ?? existing.publishDate;
    const shouldSetPublishedAt = status === "published";
    const publishedAt = shouldSetPublishedAt
      ? existing.publishedAt || nextPublishDate || new Date()
      : null;

    let featuredImageUrl = existing.featuredImageUrl;
    let featuredImageAlt = existing.featuredImageAlt;

    if (shouldDeleteImage) {
      featuredImageUrl = null;
      featuredImageAlt = null;
    }

    if (imageUrl) {
      featuredImageUrl = imageUrl;
      featuredImageAlt = String(payload.featuredImageAlt || "").trim();
    } else if (featuredImageUrl) {
      featuredImageAlt = String(payload.featuredImageAlt || featuredImageAlt || "").trim();
    }

    const updated = await prisma.post.update({
      where: { id: req.params.id },
      data: {
        title: String(payload.title || existing.title).trim(),
        subheading: payload.subheading?.trim() ?? existing.subheading,
        slug,
        category: payload.category?.trim() || existing.category,
        content: sanitizeContent(payload.content || existing.content),
        metaTitle: payload.metaTitle?.trim() ?? existing.metaTitle,
        metaDescription: payload.metaDescription?.trim() ?? existing.metaDescription,
        socialFacebook: socialChannels.facebook,
        socialInstagram: socialChannels.instagram,
        socialLinkedin: socialChannels.linkedin,
        socialTwitter: socialChannels.twitter,
        status,
        publishDate: nextPublishDate || null,
        publishedAt,
        featuredImageUrl,
        featuredImageAlt,
      },
    });

    return res.json({ post: serializePost(updated) });
  } catch (error) {
    return next(error);
  }
}

export async function deleteAdminPost(req, res, next) {
  try {
    await prisma.post.delete({ where: { id: req.params.id } });

    return res.status(204).send();
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Post not found" });
    }

    return next(error);
  }
}
