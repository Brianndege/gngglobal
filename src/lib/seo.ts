import { siteConfig } from "@/lib/site";

type ListItem = {
  name: string;
  item: string;
};

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.addressLines[0],
      addressLocality: "Nedlands",
      addressRegion: "WA",
      postalCode: "6009",
      addressCountry: "AU",
    },
    sameAs: ["https://www.linkedin.com/company/gng-global/"],
  };
}

export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "en-AU",
  };
}

export function getBreadcrumbJsonLd(items: ListItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

interface PortfolioCompanySchemaInput {
  name: string;
  description: string;
  path: string;
  sector: string;
}

export function getPortfolioCompanyJsonLd(input: PortfolioCompanySchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: input.name,
    description: input.description,
    url: `${siteConfig.url}${input.path}`,
    parentOrganization: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    knowsAbout: [input.sector],
  };
}

export function stringifyJsonLd(value: object) {
  return JSON.stringify(value);
}
