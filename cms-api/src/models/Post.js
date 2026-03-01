import mongoose from "mongoose";

const featuredImageSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true },
    alt: { type: String, trim: true },
  },
  { _id: false }
);

const socialChannelsSchema = new mongoose.Schema(
  {
    facebook: { type: Boolean, default: false },
    instagram: { type: Boolean, default: false },
    linkedin: { type: Boolean, default: false },
    twitter: { type: Boolean, default: false },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subheading: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    category: { type: String, trim: true, default: "General" },
    featuredImage: { type: featuredImageSchema, default: () => ({}) },
    content: { type: String, required: true },
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    socialChannels: { type: socialChannelsSchema, default: () => ({}) },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    publishDate: { type: Date },
    publishedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

postSchema.pre("save", function setPublishedAt(next) {
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = this.publishDate ?? new Date();
  }

  if (this.status === "draft") {
    this.publishedAt = undefined;
  }

  next();
});

export const Post = mongoose.model("Post", postSchema);
