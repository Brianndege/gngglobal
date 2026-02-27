import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gngglobal.com.au";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GNG Global Investment Group - Investment Firm Perth, Australia",
    template: "%s | GNG Global Investment Group",
  },
  description:
    "GNG Global Investment Group is an investment firm founded in Perth, Australia. We have strategic investments in healthcare, media, financial services, and advisory services, using our proprietary GNG Value Exchange framework.",
  keywords: [
    "investment firm",
    "Perth",
    "Australia",
    "GNG Global",
    "healthcare",
    "property",
    "NDIS",
    "value exchange",
  ],
  authors: [{ name: "GNG Global Investment Group" }],
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    siteName: "GNG Global Investment Group",
    title: "GNG Global Investment Group - Investment Firm Perth, Australia",
    description:
      "Strategic investments in healthcare, media, financial services, and advisory services using the GNG Value Exchange framework.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GNG Global Investment Group",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GNG Global Investment Group",
    description:
      "Investment firm based in Perth, Australia with strategic investments across multiple sectors.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="scroll-smooth"
    >
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
