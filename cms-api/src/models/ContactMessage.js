import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
      maxlength: 60,
    },
    company: {
      type: String,
      trim: true,
      default: "",
      maxlength: 160,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    status: {
      type: String,
      enum: ["new", "responded"],
      default: "new",
      index: true,
    },
    responseNotes: {
      type: String,
      trim: true,
      default: "",
      maxlength: 4000,
    },
    respondedAt: {
      type: Date,
      default: null,
    },
    source: {
      type: String,
      trim: true,
      default: "contact-page",
    },
  },
  { timestamps: true }
);

export const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);
