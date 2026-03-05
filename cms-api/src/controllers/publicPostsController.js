import { prisma } from "../config/prisma.js";
import { serializePost } from "../utils/serializers.js";

export async function getPublishedPosts(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 6, 1), 50);
    const category = req.query.category && req.query.category !== "All" ? req.query.category : null;

    const where = {
      status: "published",
      ...(category ? { category } : {}),
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    const categories = await prisma.post.findMany({
      where: { status: "published" },
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    });

    return res.json({
      posts: posts.map(serializePost),
      categories: categories.map((entry) => entry.category).filter(Boolean),
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

    const post = await prisma.post.findFirst({
      where: { slug, status: "published" },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json({ post: serializePost(post) });
  } catch (error) {
    return next(error);
  }
}
