import mongoose from "mongoose";

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    source: {
      type: String,
      default: "news-page",
      trim: true,
    },
    consent: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "unsubscribed"],
      default: "active",
      index: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const NewsletterSubscriber = mongoose.model("NewsletterSubscriber", newsletterSubscriberSchema);
