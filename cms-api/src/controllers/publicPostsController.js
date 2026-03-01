import { Post } from "../models/Post.js";

export async function getPublishedPosts(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 6, 1), 50);
    const category = req.query.category && req.query.category !== "All" ? req.query.category : null;

    const filter = { status: "published" };
    if (category) {
      filter.category = category;
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Post.countDocuments(filter),
    ]);

    const categories = await Post.distinct("category", { status: "published" });

    return res.json({
      posts,
      categories: categories.filter(Boolean),
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

export async function getPublishedPostBySlug(req, res, next) {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug, status: "published" }).lean();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json({ post });
  } catch (error) {
    return next(error);
  }
}
