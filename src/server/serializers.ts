interface PostLike {
  id: string;
  title: string;
  subheading: string | null;
  slug: string;
  category: string;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  socialFacebook: boolean;
  socialInstagram: boolean;
  socialLinkedin: boolean;
  socialTwitter: boolean;
  status: string;
  publishDate: Date | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
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
    subheading: post.subheading || "",
    slug: post.slug,
    category: post.category,
    featuredImage: {
      url: post.featuredImageUrl || "",
      alt: post.featuredImageAlt || "",
    },
    content: post.content,
    metaTitle: post.metaTitle || "",
    metaDescription: post.metaDescription || "",
    socialChannels: {
      facebook: Boolean(post.socialFacebook),
      instagram: Boolean(post.socialInstagram),
      linkedin: Boolean(post.socialLinkedin),
      twitter: Boolean(post.socialTwitter),
    },
    status: post.status,
    publishDate: post.publishDate,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
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
