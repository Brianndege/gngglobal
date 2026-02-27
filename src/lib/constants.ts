/** Site-wide constants for GNG Global Investment Group */

export const SITE_NAME = "GNG Global Investment Group";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://gngglobal.com.au";

export const CONTACT = {
  address: "136 Stirling Highway, Nedlands WA 6009",
  phone: "+61 8 9000 0000",
  email: "info@gngglobal.com.au",
  officeHours: {
    weekdays: "9:00 AM – 5:30 PM",
    weekend: "By appointment",
  },
} as const;

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/gngglobal",
  twitter: "https://twitter.com/gngglobal",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Portfolio",
    href: "/portfolio",
    children: [
      { label: "All Portfolio", href: "/portfolio" },
      { label: "Healthcare Group", href: "/portfolio/healthcare" },
    ],
  },
  { label: "Team", href: "/team" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
] as const;

export const PORTFOLIO_SECTORS = [
  "Healthcare & NDIS",
  "Property & Development",
  "Media & Entertainment",
  "Financial Services",
] as const;

export const VALUE_EXCHANGE_PILLARS = [
  {
    title: "Protection",
    description:
      "We protect our stakeholders' interests through careful risk management and strategic oversight.",
  },
  {
    title: "Balance",
    description:
      "We maintain balance between commercial outcomes and social responsibility across all ventures.",
  },
  {
    title: "Trust",
    description:
      "We build trust through transparency, integrity, and consistent delivery on our commitments.",
  },
  {
    title: "Excellence",
    description:
      "We pursue excellence in every engagement, setting high standards for our portfolio companies.",
  },
] as const;

/** Animation durations in seconds */
export const ANIMATION = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  carousel: 5000, // ms
} as const;

/** Breakpoints matching Tailwind defaults */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
