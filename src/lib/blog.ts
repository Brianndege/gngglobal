import { CmsPost } from "@/lib/cms";

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "into",
  "over",
  "under",
  "your",
  "their",
  "our",
  "about",
  "have",
  "will",
  "were",
  "been",
  "also",
  "more",
  "than",
  "when",
  "where",
  "what",
  "which",
]);

export function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function getReadingTimeMinutes(html: string) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return minutes;
}

export function slugifyText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function extractHeadings(html: string) {
  const headings: HeadingItem[] = [];
  const regex = /<h([2-3])[^>]*>(.*?)<\/h\1>/gi;
  let match: RegExpExecArray | null = regex.exec(html);

  while (match) {
    const level = Number(match[1]);
    const text = stripHtml(match[2]).trim();
    if (text) {
      headings.push({ id: slugifyText(text), text, level });
    }
    match = regex.exec(html);
  }

  return headings;
}

export function withHeadingAnchors(html: string) {
  return html.replace(/<h([2-3])([^>]*)>(.*?)<\/h\1>/gi, (_full, level, attrs, inner) => {
    const text = stripHtml(inner).trim();
    const id = slugifyText(text || `section-${level}`);
    return `<h${level}${attrs} id="${id}" class="scroll-mt-28">${inner}</h${level}>`;
  });
}

export function extractTags(post: CmsPost) {
  const seed = `${post.title} ${post.subheading || ""} ${post.metaDescription || ""}`;
  const words = seed
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 4 && !STOP_WORDS.has(word));

  const uniques = Array.from(new Set(words));
  return uniques.slice(0, 5);
}

export function getPostTimestamp(post: CmsPost) {
  const dateValue = post.publishedAt || post.publishDate || post.createdAt;
  const timestamp = new Date(dateValue).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function getTrendingScore(post: CmsPost) {
  const ageMs = Date.now() - getPostTimestamp(post);
  const ageDays = Math.max(1, ageMs / (1000 * 60 * 60 * 24));
  const freshnessBoost = 80 / ageDays;
  const contentDepth = Math.min(stripHtml(post.content).length / 120, 40);
  const socialBoost = Object.values(post.socialChannels || {}).filter(Boolean).length * 6;
  return freshnessBoost + contentDepth + socialBoost;
}

export function getPostImageUrl(post: CmsPost, cmsBase: string) {
  const rawUrl = post.featuredImage?.url?.trim();
  if (!rawUrl) return "";
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) return rawUrl;
  return `${cmsBase}${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`;
}
