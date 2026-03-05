import { POST } from "@/app/api/admin/login/route";

const findUniqueMock = jest.fn();
const compareMock = jest.fn();

jest.mock("@/server/prisma", () => ({
  prisma: {
    adminUser: {
      findUnique: (...args: unknown[]) => findUniqueMock(...args),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  compare: (...args: unknown[]) => compareMock(...args),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "signed"),
}));

describe("security: admin login route", () => {
  it("rejects missing credentials", async () => {
    const response = await POST(new Request("http://localhost/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email: "", password: "" }),
      headers: { "Content-Type": "application/json" },
    }));

    expect(response.status).toBe(400);
  });

  it("returns 500 when jwt secret is absent", async () => {
    const originalSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    findUniqueMock.mockResolvedValue({ id: "a1", email: "admin@test.com", passwordHash: "hash", name: "Admin", role: "admin" });
    compareMock.mockResolvedValue(true);

    const response = await POST(new Request("http://localhost/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email: "admin@test.com", password: "pass" }),
      headers: { "Content-Type": "application/json" },
    }));

    expect(response.status).toBe(500);
    process.env.JWT_SECRET = originalSecret;
  });
});
