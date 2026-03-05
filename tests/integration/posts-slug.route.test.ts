import { GET } from "@/app/api/posts/[slug]/route";

const findFirstMock = jest.fn();

jest.mock("@/server/prisma", () => ({
  prisma: {
    post: {
      findFirst: (...args: unknown[]) => findFirstMock(...args),
    },
  },
}));

jest.mock("@/server/serializers", () => ({
  serializePost: (post: unknown) => post,
}));

describe("integration: public post by slug route", () => {
  it("returns 404 when post missing", async () => {
    findFirstMock.mockResolvedValue(null);

    const response = await GET(new Request("http://localhost/api/posts/missing"), {
      params: Promise.resolve({ slug: "missing" }),
    });

    expect(response.status).toBe(404);
  });

  it("returns cached post response", async () => {
    findFirstMock.mockResolvedValue({ id: "p1", slug: "abc", title: "Post" });

    const response = await GET(new Request("http://localhost/api/posts/abc"), {
      params: Promise.resolve({ slug: "abc" }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toContain("s-maxage=300");
  });

  it("returns 500 on prisma error", async () => {
    findFirstMock.mockRejectedValueOnce(new Error("db fail"));

    const response = await GET(new Request("http://localhost/api/posts/abc"), {
      params: Promise.resolve({ slug: "abc" }),
    });

    expect(response.status).toBe(500);
  });
});
