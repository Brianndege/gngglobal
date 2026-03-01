"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminAuthHeaders } from "@/lib/adminAuth";
import { CmsPost, getCmsApiBaseUrl } from "@/lib/cms";

interface PostEditorFormProps {
  mode: "create" | "edit";
  initialPost?: CmsPost;
}

export default function PostEditorForm({ mode, initialPost }: PostEditorFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [subheading, setSubheading] = useState(initialPost?.subheading ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [category, setCategory] = useState(initialPost?.category ?? "General");
  const [content, setContent] = useState(initialPost?.content ?? "");
  const [metaTitle, setMetaTitle] = useState(initialPost?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(initialPost?.metaDescription ?? "");
  const [status, setStatus] = useState<"draft" | "published">(initialPost?.status ?? "draft");
  const [publishDate, setPublishDate] = useState(initialPost?.publishDate?.slice(0, 10) ?? "");
  const [featuredImageAlt, setFeaturedImageAlt] = useState(initialPost?.featuredImage?.alt ?? "");
  const [shareFacebook, setShareFacebook] = useState(Boolean(initialPost?.socialChannels?.facebook));
  const [shareInstagram, setShareInstagram] = useState(Boolean(initialPost?.socialChannels?.instagram));
  const [shareLinkedIn, setShareLinkedIn] = useState(Boolean(initialPost?.socialChannels?.linkedin));
  const [shareTwitter, setShareTwitter] = useState(Boolean(initialPost?.socialChannels?.twitter));
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewContent = useMemo(() => ({ __html: content || "<p>No preview content</p>" }), [content]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("subheading", subheading);
      formData.set("slug", slug);
      formData.set("category", category);
      formData.set("content", content);
      formData.set("metaTitle", metaTitle);
      formData.set("metaDescription", metaDescription);
      formData.set("status", status);
      formData.set("publishDate", publishDate);
      formData.set("featuredImageAlt", featuredImageAlt);
      formData.set("removeFeaturedImage", String(removeImage));
      formData.set("facebook", String(shareFacebook));
      formData.set("instagram", String(shareInstagram));
      formData.set("linkedin", String(shareLinkedIn));
      formData.set("twitter", String(shareTwitter));

      if (featuredImageFile) {
        formData.set("featuredImage", featuredImageFile);
      }

      const isEdit = mode === "edit" && initialPost?._id;
      const url = isEdit
        ? `${getCmsApiBaseUrl()}/api/admin/posts/${initialPost?._id}`
        : `${getCmsApiBaseUrl()}/api/admin/posts`;

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          ...getAdminAuthHeaders(),
        },
        body: formData,
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = payload?.errors?.join(", ") || payload?.message || "Failed to save post";
        throw new Error(message);
      }

      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="rounded-lg border border-ivory-300 bg-white p-6">
        <h2 className="text-xl font-semibold text-navy-800 mb-4">Post Details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Subheading</label>
            <input value={subheading} onChange={(e) => setSubheading(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")} className="w-full rounded-md border border-charcoal-300 px-3 py-2">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Publish Date</label>
            <input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2" />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-ivory-300 bg-white p-6">
        <h2 className="text-xl font-semibold text-navy-800 mb-4">Content (WYSIWYG HTML)</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={14}
          className="w-full rounded-md border border-charcoal-300 px-3 py-2 font-mono text-sm"
          required
        />
      </section>

      <section className="rounded-lg border border-ivory-300 bg-white p-6">
        <h2 className="text-xl font-semibold text-navy-800 mb-4">Featured Image</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Upload / Replace image</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              onChange={(e) => setFeaturedImageFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-md border border-charcoal-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Image alt text</label>
            <input
              value={featuredImageAlt}
              onChange={(e) => setFeaturedImageAlt(e.target.value)}
              className="w-full rounded-md border border-charcoal-300 px-3 py-2"
              placeholder="Describe the featured image"
            />
          </div>
        </div>

        {initialPost?.featuredImage?.url && (
          <div className="mt-4 flex items-center gap-3">
            <img src={initialPost.featuredImage.url} alt={initialPost.featuredImage.alt || initialPost.title} className="h-20 w-28 object-cover rounded border border-ivory-300" />
            <button
              type="button"
              onClick={() => setRemoveImage((prev) => !prev)}
              className={`rounded-md px-3 py-1.5 text-sm ${removeImage ? "bg-destructive text-white" : "border border-charcoal-300"}`}
            >
              {removeImage ? "Image will be removed" : "Delete current image"}
            </button>
          </div>
        )}
      </section>

      <section className="rounded-lg border border-ivory-300 bg-white p-6">
        <h2 className="text-xl font-semibold text-navy-800 mb-4">SEO Metadata</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Meta title</label>
            <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Meta description</label>
            <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className="w-full rounded-md border border-charcoal-300 px-3 py-2" />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-ivory-300 bg-white p-6">
        <h2 className="text-xl font-semibold text-navy-800 mb-4">Preview</h2>
        <div className="group bg-white rounded-lg overflow-hidden shadow-lg border border-ivory-300">
          <div className="relative h-64 overflow-hidden">
            {featuredImageFile ? (
              <img src={URL.createObjectURL(featuredImageFile)} alt={featuredImageAlt || title || "Preview image"} className="w-full h-full object-cover" />
            ) : initialPost?.featuredImage?.url && !removeImage ? (
              <img src={initialPost.featuredImage.url} alt={featuredImageAlt || initialPost.featuredImage.alt || title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-navy-900 to-charcoal-900" />
            )}
          </div>
          <div className="p-6">
            <h3 className="font-playfair text-2xl font-bold text-navy-800 mb-2">{title || "Post title"}</h3>
            <p className="font-inter text-charcoal-600 mb-4">{subheading || "Subheading preview"}</p>
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={previewContent} />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-ivory-300 bg-white p-6">
        <h2 className="text-xl font-semibold text-navy-800 mb-4">Optional Social Posting</h2>
        <p className="text-sm text-charcoal-600 mb-4">
          Select where this post should also be published. All options are optional.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="inline-flex items-center gap-2 rounded-md border border-ivory-300 px-3 py-2">
            <input type="checkbox" checked={shareFacebook} onChange={(event) => setShareFacebook(event.target.checked)} />
            <span className="text-sm font-medium">Facebook</span>
          </label>
          <label className="inline-flex items-center gap-2 rounded-md border border-ivory-300 px-3 py-2">
            <input type="checkbox" checked={shareInstagram} onChange={(event) => setShareInstagram(event.target.checked)} />
            <span className="text-sm font-medium">Instagram</span>
          </label>
          <label className="inline-flex items-center gap-2 rounded-md border border-ivory-300 px-3 py-2">
            <input type="checkbox" checked={shareLinkedIn} onChange={(event) => setShareLinkedIn(event.target.checked)} />
            <span className="text-sm font-medium">LinkedIn</span>
          </label>
          <label className="inline-flex items-center gap-2 rounded-md border border-ivory-300 px-3 py-2">
            <input type="checkbox" checked={shareTwitter} onChange={(event) => setShareTwitter(event.target.checked)} />
            <span className="text-sm font-medium">Twitter / X</span>
          </label>
        </div>
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="rounded-md bg-navy-700 hover:bg-navy-800 text-white px-5 py-2 font-semibold disabled:opacity-60">
          {saving ? "Saving..." : mode === "create" ? "Create Post" : "Update Post"}
        </button>
        <button type="button" onClick={() => router.push("/admin/dashboard")} className="rounded-md border border-charcoal-300 px-5 py-2">Cancel</button>
      </div>
    </form>
  );
}
