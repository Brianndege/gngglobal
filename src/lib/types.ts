/** Shared TypeScript interfaces for GNG Global Investment Group */

/** Generic navigation link */
export interface NavLink {
  label: string;
  href: string;
  readonly children?: readonly NavLink[];
}

/** Team member profile */
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
}

/** Portfolio company */
export interface PortfolioCompany {
  id: string;
  name: string;
  sector: string;
  description: string;
  image: string;
  href: string;
  services?: string[];
  locations?: string[];
}

/** News / blog article */
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  author?: string;
  href: string;
  featured?: boolean;
}

/** Value Exchange pillar */
export interface ValuePillar {
  title: string;
  description: string;
  icon?: string;
}

/** Hero carousel slide */
export interface CarouselSlide {
  id: string;
  heading: string;
  subheading: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
}

/** Contact form data */
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

/** API response wrapper */
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
}

/** Scroll reveal animation direction */
export type RevealDirection = "up" | "down" | "left" | "right" | "scale";

/** Card grid variant */
export type CardGridVariant = "default" | "feature" | "minimal" | "stat";

/** Image with alt text */
export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}
