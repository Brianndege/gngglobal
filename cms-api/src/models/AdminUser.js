import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, trim: true, default: "Admin" },
  },
  { timestamps: true }
);

export const AdminUser = mongoose.model("AdminUser", adminUserSchema);
