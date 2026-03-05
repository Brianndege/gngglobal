export interface CmsPost {
  _id: string;
  title: string;
  subheading?: string;
  slug: string;
  category: string;
  featuredImage?: {
    url?: string;
    alt?: string;
  };
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  socialChannels?: {
    facebook?: boolean;
    instagram?: boolean;
    linkedin?: boolean;
    twitter?: boolean;
  };
  status: "draft" | "published";
  publishDate?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CmsPostsResponse {
  posts: CmsPost[];
  categories: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  source?: string;
  consent: boolean;
  status: "active" | "unsubscribed";
  subscribedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  status: "new" | "responded";
  responseNotes?: string;
  respondedAt?: string | null;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export function getCmsApiBaseUrl() {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_CMS_API_URL?.trim();

  if (configuredBaseUrl) {
    const normalized = configuredBaseUrl.replace(/\/$/, "");

    // Safety guard: if a localhost URL was baked into a production build,
    // fall back to same-origin APIs instead of making unreachable requests.
    if (typeof window !== "undefined") {
      const isConfiguredLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalized);
      const isCurrentOriginLocalhost = /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);

      if (isConfiguredLocalhost && !isCurrentOriginLocalhost) {
        return "";
      }
    }

    return normalized;
  }

  // Default to same-origin and rely on Next rewrites for /api and /uploads.
  return "";
}

export async function fetchPublishedPosts(params: { page?: number; limit?: number; category?: string }) {
  const base = getCmsApiBaseUrl();
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.category && params.category !== "All") query.set("category", params.category);

  const response = await fetch(`${base}/api/posts?${query.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return (await response.json()) as CmsPostsResponse;
}

export async function fetchPublishedPostBySlug(slug: string) {
  const base = getCmsApiBaseUrl();
  const response = await fetch(`${base}/api/posts/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Post not found");
  }

  const data = (await response.json()) as { post: CmsPost };
  return data.post;
}
