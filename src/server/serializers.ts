interface PostLike {
  id: string;
  title: string;
  excerpt: string | null;
  subheading: string | null;
  slug: string;
  category: string;
  tags: string[];
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  mediaLibrary: unknown;
  content: string;
  contentFormat: string;
  markdownContent: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  twitterCard: string | null;
  socialFacebook: boolean;
  socialInstagram: boolean;
  socialLinkedin: boolean;
  socialTwitter: boolean;
  relatedPostIds: string[];
  isFeatured: boolean;
  status: string;
  workflowStatus: string;
  approvalNotes: string | null;
  scheduledFor: Date | null;
  publishDate: Date | null;
  publishedAt: Date | null;
  archivedAt: Date | null;
  lastAutoSavedAt: Date | null;
  assignedAuthorId: string | null;
  authorId: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  referralSources: unknown;
  createdAt: Date;
  updatedAt: Date;
}

interface PostRevisionLike {
  id: string;
  postId: string;
  title: string;
  excerpt: string | null;
  subheading: string | null;
  slug: string;
  category: string;
  tags: string[];
  content: string;
  contentFormat: string;
  markdownContent: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  twitterCard: string | null;
  socialFacebook: boolean;
  socialInstagram: boolean;
  socialLinkedin: boolean;
  socialTwitter: boolean;
  relatedPostIds: string[];
  isFeatured: boolean;
  status: string;
  workflowStatus: string;
  publishDate: Date | null;
  scheduledFor: Date | null;
  revisionNote: string | null;
  createdById: string | null;
  createdAt: Date;
}

interface SubscriberLike {
  id: string;
  email: string;
  source: string;
  consent: boolean;
  status: string;
  subscribedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ContactLike {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  status: string;
  responseNotes: string;
  respondedAt: Date | null;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

export function serializePost(post: PostLike) {
  return {
    _id: post.id,
    title: post.title,
    excerpt: post.excerpt || "",
    subheading: post.subheading || "",
    slug: post.slug,
    category: post.category,
    tags: post.tags || [],
    featuredImage: {
      url: post.featuredImageUrl || "",
      alt: post.featuredImageAlt || "",
    },
    mediaLibrary: post.mediaLibrary || [],
    content: post.content,
    contentFormat: post.contentFormat || "html",
    markdownContent: post.markdownContent || "",
    metaTitle: post.metaTitle || "",
    metaDescription: post.metaDescription || "",
    canonicalUrl: post.canonicalUrl || "",
    ogTitle: post.ogTitle || "",
    ogDescription: post.ogDescription || "",
    ogImage: post.ogImage || "",
    twitterTitle: post.twitterTitle || "",
    twitterDescription: post.twitterDescription || "",
    twitterImage: post.twitterImage || "",
    twitterCard: post.twitterCard || "summary_large_image",
    socialChannels: {
      facebook: Boolean(post.socialFacebook),
      instagram: Boolean(post.socialInstagram),
      linkedin: Boolean(post.socialLinkedin),
      twitter: Boolean(post.socialTwitter),
    },
    relatedPostIds: post.relatedPostIds || [],
    isFeatured: Boolean(post.isFeatured),
    status: post.status,
    workflowStatus: post.workflowStatus || "draft",
    approvalNotes: post.approvalNotes || "",
    scheduledFor: post.scheduledFor,
    publishDate: post.publishDate,
    publishedAt: post.publishedAt,
    archivedAt: post.archivedAt,
    lastAutoSavedAt: post.lastAutoSavedAt,
    assignedAuthorId: post.assignedAuthorId || "",
    authorId: post.authorId || "",
    analytics: {
      views: post.viewCount || 0,
      likes: post.likeCount || 0,
      comments: post.commentCount || 0,
      referralSources: post.referralSources || {},
    },
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

export function serializePostRevision(item: PostRevisionLike) {
  return {
    _id: item.id,
    postId: item.postId,
    title: item.title,
    excerpt: item.excerpt || "",
    subheading: item.subheading || "",
    slug: item.slug,
    category: item.category,
    tags: item.tags || [],
    content: item.content,
    contentFormat: item.contentFormat || "html",
    markdownContent: item.markdownContent || "",
    metaTitle: item.metaTitle || "",
    metaDescription: item.metaDescription || "",
    canonicalUrl: item.canonicalUrl || "",
    ogTitle: item.ogTitle || "",
    ogDescription: item.ogDescription || "",
    ogImage: item.ogImage || "",
    twitterTitle: item.twitterTitle || "",
    twitterDescription: item.twitterDescription || "",
    twitterImage: item.twitterImage || "",
    twitterCard: item.twitterCard || "summary_large_image",
    socialChannels: {
      facebook: Boolean(item.socialFacebook),
      instagram: Boolean(item.socialInstagram),
      linkedin: Boolean(item.socialLinkedin),
      twitter: Boolean(item.socialTwitter),
    },
    relatedPostIds: item.relatedPostIds || [],
    isFeatured: Boolean(item.isFeatured),
    status: item.status,
    workflowStatus: item.workflowStatus || "draft",
    publishDate: item.publishDate,
    scheduledFor: item.scheduledFor,
    revisionNote: item.revisionNote || "",
    createdById: item.createdById || "",
    createdAt: item.createdAt,
  };
}

export function serializeSubscriber(item: SubscriberLike) {
  return {
    _id: item.id,
    email: item.email,
    source: item.source,
    consent: item.consent,
    status: item.status,
    subscribedAt: item.subscribedAt,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export function serializeContact(item: ContactLike) {
  return {
    _id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    company: item.company,
    message: item.message,
    status: item.status,
    responseNotes: item.responseNotes,
    respondedAt: item.respondedAt,
    source: item.source,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}
