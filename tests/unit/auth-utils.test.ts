import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { getBearerToken, verifyAdminToken } from "@/server/auth";

describe("unit: auth utils", () => {
  it("extracts bearer token from authorization header", () => {
    const request = new NextRequest("http://localhost/api/admin/posts", {
      headers: { authorization: "Bearer token-123" },
    });

    expect(getBearerToken(request)).toBe("token-123");
  });

  it("returns null for missing bearer scheme", () => {
    const request = new NextRequest("http://localhost/api/admin/posts", {
      headers: { authorization: "Basic abc" },
    });

    expect(getBearerToken(request)).toBeNull();
  });

  it("returns null when authorization header is absent", () => {
    const request = new NextRequest("http://localhost/api/admin/posts");
    expect(getBearerToken(request)).toBeNull();
  });

  it("verifies admin token payload", () => {
    process.env.JWT_SECRET = "test-secret";
    const token = jwt.sign({ sub: "1", email: "admin@test.com", role: "admin" }, process.env.JWT_SECRET);

    const payload = verifyAdminToken(token);
    expect(payload.sub).toBe("1");
    expect(payload.role).toBe("admin");
  });

  it("throws when JWT secret is missing", () => {
    delete process.env.JWT_SECRET;
    expect(() => verifyAdminToken("invalid")).toThrow("JWT_SECRET is required");
  });
});
