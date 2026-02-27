import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";

export const metadata: Metadata = {
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
    "healthcare investment",
    "property investment",
    "GNG Value Exchange",
  ],
  authors: [{ name: "GNG Global Investment Group" }],
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://gngglobal.com.au",
    siteName: "GNG Global Investment Group",
    title: "GNG Global Investment Group - Investment Firm Perth, Australia",
    description:
      "Strategic investments in healthcare, media, financial services, and advisory services using the proprietary GNG Value Exchange framework.",
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
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google Fonts - loaded at runtime to avoid build-time network dependency */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
