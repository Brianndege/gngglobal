import sanitizeHtml from "sanitize-html";
import { Post } from "../models/Post.js";
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
  const query = { slug };
  if (ignoreId) {
    query._id = { $ne: ignoreId };
  }

  const existing = await Post.findOne(query).select("_id").lean();
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
    const posts = await Post.find({}).sort({ updatedAt: -1 }).lean();
    return res.json({ posts });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminPostById(req, res, next) {
  try {
    const post = await Post.findById(req.params.id).lean();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json({ post });
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

    const post = await Post.create({
      title: String(payload.title).trim(),
      subheading: payload.subheading?.trim() || "",
      slug,
      category: payload.category?.trim() || "General",
      featuredImage: imageUrl
        ? { url: imageUrl, alt: String(payload.featuredImageAlt).trim() }
        : undefined,
      content: sanitizeContent(payload.content),
      metaTitle: payload.metaTitle?.trim() || "",
      metaDescription: payload.metaDescription?.trim() || "",
      socialChannels: parseSocialChannels(payload),
      status,
      publishDate: parseDate(payload.publishDate),
      publishedAt: status === "published" ? parseDate(payload.publishDate) || new Date() : undefined,
    });

    return res.status(201).json({ post });
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminPost(req, res, next) {
  try {
    const existing = await Post.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: "Post not found" });
    }

    const payload = req.body;
    const status = parseStatus(payload.status || existing.status);
    const imageUrl = resolveImageUrl(req, req.file);
    const shouldDeleteImage = String(payload.removeFeaturedImage || "false") === "true";

    const rawSlug = payload.slug ? slugify(payload.slug) : slugify(payload.title || existing.title);
    const errors = validatePayload(
      { ...existing.toObject(), ...payload },
      Boolean(imageUrl),
      !shouldDeleteImage && Boolean(existing.featuredImage?.url)
    );

    if (!rawSlug) {
      errors.push("Slug is required");
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const slug = await ensureUniqueSlug(rawSlug, existing._id);

    existing.title = String(payload.title || existing.title).trim();
    existing.subheading = payload.subheading?.trim() ?? existing.subheading;
    existing.slug = slug;
    existing.category = payload.category?.trim() || existing.category;
    existing.content = sanitizeContent(payload.content || existing.content);
    existing.metaTitle = payload.metaTitle?.trim() ?? existing.metaTitle;
    existing.metaDescription = payload.metaDescription?.trim() ?? existing.metaDescription;
    existing.socialChannels = parseSocialChannels(payload, existing.socialChannels);
    existing.status = status;
    existing.publishDate = parseDate(payload.publishDate) ?? existing.publishDate;

    if (shouldDeleteImage) {
      existing.featuredImage = { url: "", alt: "" };
    }

    if (imageUrl) {
      existing.featuredImage = {
        url: imageUrl,
        alt: String(payload.featuredImageAlt || "").trim(),
      };
    } else if (existing.featuredImage?.url) {
      existing.featuredImage.alt = String(payload.featuredImageAlt || existing.featuredImage.alt || "").trim();
    }

    if (status === "published" && !existing.publishedAt) {
      existing.publishedAt = existing.publishDate || new Date();
    }

    if (status === "draft") {
      existing.publishedAt = undefined;
    }

    await existing.save();

    return res.json({ post: existing });
  } catch (error) {
    return next(error);
  }
}

export async function deleteAdminPost(req, res, next) {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
