import { NextRequest } from "next/server";
import { GET, PUT, DELETE } from "@/app/api/admin/posts/[id]/route";
import { samplePost } from "../mocks/fixtures";

const verifyAdminTokenMock = jest.fn();
const getBearerTokenMock = jest.fn(() => "token");
const findUniqueMock = jest.fn();
const findManyRevisionMock = jest.fn();
const findFirstRevisionMock = jest.fn();
const updateMock = jest.fn();
const deleteMock = jest.fn();
const createRevisionMock = jest.fn();
const findFirstPostMock = jest.fn();

jest.mock("@/server/auth", () => ({
  verifyAdminToken: (...args: unknown[]) => verifyAdminTokenMock(...args),
  getBearerToken: (...args: unknown[]) => getBearerTokenMock(...args),
}));

jest.mock("@/server/prisma", () => ({
  prisma: {
    post: {
      findUnique: (...args: unknown[]) => findUniqueMock(...args),
      findFirst: (...args: unknown[]) => findFirstPostMock(...args),
      update: (...args: unknown[]) => updateMock(...args),
      delete: (...args: unknown[]) => deleteMock(...args),
    },
    postRevision: {
      findMany: (...args: unknown[]) => findManyRevisionMock(...args),
      findFirst: (...args: unknown[]) => findFirstRevisionMock(...args),
      create: (...args: unknown[]) => createRevisionMock(...args),
    },
  },
}));

describe("integration: admin post by id route", () => {
  beforeEach(() => {
    verifyAdminTokenMock.mockReturnValue({ sub: "a1", role: "admin", email: "admin@test.com" });
    findUniqueMock.mockResolvedValue({ ...samplePost, id: "post-1" });
  });

  it("returns post with revisions", async () => {
    findManyRevisionMock.mockResolvedValue([{ id: "rev1", postId: "post-1", createdAt: new Date(), title: "t", slug: "s", category: "c", tags: [], content: "x", contentFormat: "html", markdownContent: null, metaTitle: null, metaDescription: null, canonicalUrl: null, ogTitle: null, ogDescription: null, ogImage: null, twitterTitle: null, twitterDescription: null, twitterImage: null, twitterCard: null, socialFacebook: false, socialInstagram: false, socialLinkedin: false, socialTwitter: false, relatedPostIds: [], isFeatured: false, status: "draft", workflowStatus: "draft", publishDate: null, scheduledFor: null, revisionNote: null, createdById: null, excerpt: null, subheading: null }]);

    const response = await GET(new NextRequest("http://localhost/api/admin/posts/post-1"), { params: Promise.resolve({ id: "post-1" }) });
    expect(response.status).toBe(200);
  });

  it("autosaves draft content", async () => {
    updateMock.mockResolvedValue({ ...samplePost, id: "post-1" });
    const formData = new FormData();
    formData.set("title", "Autosaved");
    formData.set("content", "<p>Updated</p>");

    const request = new NextRequest("http://localhost/api/admin/posts/post-1?action=autosave", {
      method: "PUT",
      body: formData,
    });

    const response = await PUT(request, { params: Promise.resolve({ id: "post-1" }) });
    expect(response.status).toBe(200);
  });

  it("returns 400 when restore action is missing revision id", async () => {
    const request = new NextRequest("http://localhost/api/admin/posts/post-1?action=restore", {
      method: "PUT",
      body: new FormData(),
    });

    const response = await PUT(request, { params: Promise.resolve({ id: "post-1" }) });
    expect(response.status).toBe(400);
  });

  it("returns 404 when deleting missing post", async () => {
    deleteMock.mockRejectedValueOnce({ code: "P2025" });

    const response = await DELETE(new NextRequest("http://localhost/api/admin/posts/missing", { method: "DELETE" }), {
      params: Promise.resolve({ id: "missing" }),
    });

    expect(response.status).toBe(404);
  });
});
