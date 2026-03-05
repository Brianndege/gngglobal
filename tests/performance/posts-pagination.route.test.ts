import { NextRequest } from "next/server";
import { GET } from "@/app/api/posts/route";

const findManyMock = jest.fn();
const countMock = jest.fn();

jest.mock("@/server/prisma", () => ({
  prisma: {
    post: {
      findMany: (...args: unknown[]) => findManyMock(...args),
      count: (...args: unknown[]) => countMock(...args),
    },
  },
}));

describe("performance: public posts pagination", () => {
  it("caps page size and returns pagination metadata for large datasets", async () => {
    const fakeRows = Array.from({ length: 50 }, (_, index) => ({
      id: `post-${index + 1}`,
      title: `Post ${index + 1}`,
      excerpt: "",
      subheading: "",
      slug: `post-${index + 1}`,
      category: "General",
      tags: [],
      featuredImageUrl: null,
      featuredImageAlt: null,
      mediaLibrary: [],
      content: "<p>Body</p>",
      contentFormat: "html",
      markdownContent: null,
      metaTitle: "",
      metaDescription: "",
      canonicalUrl: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      twitterTitle: "",
      twitterDescription: "",
      twitterImage: "",
      twitterCard: "summary_large_image",
      socialFacebook: false,
      socialInstagram: false,
      socialLinkedin: false,
      socialTwitter: false,
      relatedPostIds: [],
      isFeatured: false,
      status: "published",
      workflowStatus: "approved",
      approvalNotes: "",
      scheduledFor: null,
      publishDate: null,
      publishedAt: new Date("2026-03-01T00:00:00.000Z"),
      archivedAt: null,
      lastAutoSavedAt: null,
      assignedAuthorId: null,
      authorId: null,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      referralSources: {},
      createdAt: new Date("2026-03-01T00:00:00.000Z"),
      updatedAt: new Date("2026-03-01T00:00:00.000Z"),
    }));

    findManyMock
      .mockResolvedValueOnce(fakeRows)
      .mockResolvedValueOnce([{ category: "General" }]);
    countMock.mockResolvedValue(1200);

    const request = new NextRequest("http://localhost/api/posts?page=1&limit=500", { method: "GET" });
    const response = await GET(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.pagination.limit).toBe(50);
    expect(payload.pagination.total).toBe(1200);
    expect(payload.pagination.totalPages).toBe(24);
    expect(payload.pagination.hasMore).toBe(true);
  });
});
