import { NextRequest } from "next/server";
import { GET } from "@/app/api/admin/contact-messages/route";

const verifyAdminTokenMock = jest.fn();
const getBearerTokenMock = jest.fn(() => "token");
const findManyMock = jest.fn();
const countMock = jest.fn();

jest.mock("@/server/auth", () => ({
  verifyAdminToken: (...args: unknown[]) => verifyAdminTokenMock(...args),
  getBearerToken: (...args: unknown[]) => getBearerTokenMock(...args),
}));

jest.mock("@/server/prisma", () => ({
  prisma: {
    contactMessage: {
      findMany: (...args: unknown[]) => findManyMock(...args),
      count: (...args: unknown[]) => countMock(...args),
    },
  },
}));

describe("integration: admin contact-messages route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    verifyAdminTokenMock.mockReturnValue({ sub: "admin-1", email: "admin@test.com", role: "admin" });
  });

  it("returns 401 when unauthenticated", async () => {
    getBearerTokenMock.mockReturnValueOnce(null);

    const response = await GET(new NextRequest("http://localhost/api/admin/contact-messages", { method: "GET" }));
    expect(response.status).toBe(401);
  });

  it("returns paginated messages", async () => {
    findManyMock.mockResolvedValueOnce([
      {
        id: "m-1",
        name: "Sam",
        email: "sam@example.com",
        phone: "+61 111 111",
        company: "GNG",
        message: "Hello",
        status: "new",
        responseNotes: "",
        respondedAt: null,
        source: "website",
        createdAt: new Date("2026-02-01T00:00:00.000Z"),
        updatedAt: new Date("2026-02-01T00:00:00.000Z"),
      },
    ]);
    countMock.mockResolvedValueOnce(1);

    const response = await GET(
      new NextRequest("http://localhost/api/admin/contact-messages?page=1&limit=10&status=new", { method: "GET" })
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.messages).toHaveLength(1);
    expect(payload.pagination.totalPages).toBe(1);
    expect(findManyMock).toHaveBeenCalledWith(
      expect.objectContaining({ where: { status: "new" }, skip: 0, take: 10 })
    );
  });

  it("returns 500 on database error", async () => {
    findManyMock.mockRejectedValueOnce(new Error("db down"));

    const response = await GET(new NextRequest("http://localhost/api/admin/contact-messages", { method: "GET" }));
    expect(response.status).toBe(500);
  });
});
