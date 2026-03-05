/** @jest-environment jsdom */

import { clearAdminToken, getAdminAuthHeaders, getAdminToken, saveAdminToken } from "@/lib/adminAuth";

describe("unit: lib/adminAuth", () => {
  it("saves and reads admin token", () => {
    saveAdminToken("abc");
    expect(getAdminToken()).toBe("abc");
  });

  it("generates auth headers when token exists", () => {
    saveAdminToken("token-123");
    expect(getAdminAuthHeaders()).toEqual({ Authorization: "Bearer token-123" });
  });

  it("clears token", () => {
    saveAdminToken("abc");
    clearAdminToken();
    expect(getAdminToken()).toBeNull();
  });
});
