import jwt from "jsonwebtoken";

export function requireAdminAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid authorization token" });
  }

  const token = header.replace("Bearer ", "").trim();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
}
