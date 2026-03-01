import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDb } from "../config/db.js";
import { AdminUser } from "../models/AdminUser.js";

dotenv.config();

async function run() {
  await connectDb(process.env.MONGODB_URI);

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required in .env");
  }

  const exists = await AdminUser.findOne({ email: email.toLowerCase().trim() });
  if (exists) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await AdminUser.create({
    email: email.toLowerCase().trim(),
    passwordHash,
    name: "Admin",
  });

  console.log("Admin user created");
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
