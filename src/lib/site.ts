export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const siteConfig = {
  name: "GNG Global Investment Group",
  shortName: "GNG Global",
  description:
    "GNG Global Investment Group is an investment firm founded in Perth, Australia with strategic investments across healthcare, media, financial services, and advisory services.",
  url: "https://gngglobal.com.au",
  contact: {
    phoneDisplay: "(08) 9305 8580",
    phoneHref: "+61893058580",
    email: "info@gngglobal.com.au",
    addressLines: ["136 Stirling Highway", "Nedlands WA 6009", "Australia"],
  },
} as const;

export const primaryNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Portfolio",
    href: "/portfolio",
    children: [
      { label: "All Companies", href: "/portfolio" },
      { label: "GNG Healthcare Group", href: "/portfolio/healthcare" },
      { label: "GNG Property Group", href: "/portfolio/property" },
      { label: "Scenes", href: "/portfolio/scenes" },
    ],
  },
  { label: "News & Media", href: "/news" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];
