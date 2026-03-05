import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { serializeAdminUser } from "../utils/serializers.js";

export async function adminLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email: String(email).toLowerCase().trim() },
    });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        sub: admin.id,
        email: admin.email,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return res.json({
      token,
      admin: serializeAdminUser(admin),
    });
  } catch (error) {
    return next(error);
  }
}
