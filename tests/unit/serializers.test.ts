import { serializeContact, serializePost, serializePostRevision, serializeSubscriber } from "@/server/serializers";
import { samplePost } from "../mocks/fixtures";

describe("unit: serializers", () => {
  it("serializes post with analytics and seo fields", () => {
    const result = serializePost(samplePost as never);

    expect(result._id).toBe(samplePost.id);
    expect(result.slug).toBe(samplePost.slug);
    expect(result.tags).toEqual(samplePost.tags);
    expect(result.analytics.views).toBe(0);
    expect(result.twitterCard).toBe("summary_large_image");
  });

  it("serializes post revision payload", () => {
    const revision = serializePostRevision({
      id: "rev-1",
      postId: "post-1",
      title: "Rev",
      excerpt: null,
      subheading: null,
      slug: "rev",
      category: "General",
      tags: ["a"],
      content: "<p>rev</p>",
      contentFormat: "html",
      markdownContent: null,
      metaTitle: null,
      metaDescription: null,
      canonicalUrl: null,
      ogTitle: null,
      ogDescription: null,
      ogImage: null,
      twitterTitle: null,
      twitterDescription: null,
      twitterImage: null,
      twitterCard: null,
      socialFacebook: false,
      socialInstagram: false,
      socialLinkedin: false,
      socialTwitter: false,
      relatedPostIds: [],
      isFeatured: false,
      status: "draft",
      workflowStatus: "draft",
      publishDate: null,
      scheduledFor: null,
      revisionNote: "note",
      createdById: null,
      createdAt: new Date("2026-03-01T00:00:00.000Z"),
    });

    expect(revision.postId).toBe("post-1");
    expect(revision.revisionNote).toBe("note");
  });

  it("serializes subscriber and contact models", () => {
    const subscriber = serializeSubscriber({
      id: "s1",
      email: "a@test.com",
      source: "news",
      consent: true,
      status: "active",
      subscribedAt: new Date("2026-03-01T00:00:00.000Z"),
      createdAt: new Date("2026-03-01T00:00:00.000Z"),
      updatedAt: new Date("2026-03-01T00:00:00.000Z"),
    });

    const contact = serializeContact({
      id: "c1",
      name: "John",
      email: "john@test.com",
      phone: "",
      company: "",
      message: "Hello",
      status: "new",
      responseNotes: "",
      respondedAt: null,
      source: "contact-page",
      createdAt: new Date("2026-03-01T00:00:00.000Z"),
      updatedAt: new Date("2026-03-01T00:00:00.000Z"),
    });

    expect(subscriber._id).toBe("s1");
    expect(contact._id).toBe("c1");
  });
});
