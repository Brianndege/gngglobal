import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export interface AdminJwtPayload {
  sub: string;
  email: string;
  role: "admin";
}

export function getBearerToken(request: NextRequest) {
  const header = request.headers.get("authorization") || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim();
}

export function verifyAdminToken(token: string): AdminJwtPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required");
  }

  return jwt.verify(token, secret) as AdminJwtPayload;
}
