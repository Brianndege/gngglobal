/** @jest-environment jsdom */

import { fetchPublishedPostBySlug, fetchPublishedPosts, getCmsApiBaseUrl } from "@/lib/cms";

describe("unit: lib/cms", () => {
  const originalEnv = process.env.NEXT_PUBLIC_CMS_API_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_CMS_API_URL = originalEnv;
    Object.defineProperty(window, "location", {
      value: { hostname: "localhost" },
      writable: true,
    });
  });

  it("defaults to same-origin when env missing", () => {
    delete process.env.NEXT_PUBLIC_CMS_API_URL;
    expect(getCmsApiBaseUrl()).toBe("");
  });

  it("uses configured URL when valid", () => {
    process.env.NEXT_PUBLIC_CMS_API_URL = "https://cms.example.com/";
    expect(getCmsApiBaseUrl()).toBe("https://cms.example.com");
  });

  it("guards localhost API URL on non-localhost origins", () => {
    process.env.NEXT_PUBLIC_CMS_API_URL = "http://localhost:8081";
    Object.defineProperty(window, "location", {
      value: { hostname: "gngglobal.netlify.app" },
      writable: true,
    });

    expect(getCmsApiBaseUrl()).toBe("");
  });

  it("fetches published posts successfully", async () => {
    process.env.NEXT_PUBLIC_CMS_API_URL = "https://cms.example.com";
    global.fetch = jest.fn(async () => ({ ok: true, json: async () => ({ posts: [], categories: [], pagination: { page: 1, limit: 5, total: 0, totalPages: 0, hasMore: false } }) } as Response)) as jest.Mock;

    const result = await fetchPublishedPosts({ page: 1, limit: 5 });
    expect(result.posts).toEqual([]);
  });

  it("throws when posts API responds with failure", async () => {
    process.env.NEXT_PUBLIC_CMS_API_URL = "https://cms.example.com";
    global.fetch = jest.fn(async () => ({ ok: false } as Response)) as jest.Mock;

    await expect(fetchPublishedPosts({ page: 1, limit: 5 })).rejects.toThrow("Failed to fetch posts");
  });

  it("fetches single post and handles missing post", async () => {
    process.env.NEXT_PUBLIC_CMS_API_URL = "https://cms.example.com";
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ post: { _id: "1", title: "T", slug: "t", category: "General", content: "<p>x</p>", status: "published", createdAt: "2026-01-01", updatedAt: "2026-01-01" } }) })
      .mockResolvedValueOnce({ ok: false });

    const post = await fetchPublishedPostBySlug("t");
    expect(post.slug).toBe("t");

    await expect(fetchPublishedPostBySlug("missing")).rejects.toThrow("Post not found");
  });
});
