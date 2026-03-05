export function serializePost(post) {
  if (!post) return null;

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

export function serializeNewsletterSubscriber(subscriber) {
  if (!subscriber) return null;

  return {
    _id: subscriber.id,
    email: subscriber.email,
    source: subscriber.source,
    consent: subscriber.consent,
    status: subscriber.status,
    subscribedAt: subscriber.subscribedAt,
    createdAt: subscriber.createdAt,
    updatedAt: subscriber.updatedAt,
  };
}

export function serializeContactMessage(message) {
  if (!message) return null;

  return {
    _id: message.id,
    name: message.name,
    email: message.email,
    phone: message.phone,
    company: message.company,
    message: message.message,
    status: message.status,
    responseNotes: message.responseNotes,
    respondedAt: message.respondedAt,
    source: message.source,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
}

export function serializeAdminUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
