import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientBody from "./ClientBody";

const playfair = localFont({
  src: [
    { path: "../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-800-normal.woff2", weight: "800", style: "normal" },
    { path: "../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-900-normal.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-playfair",
  display: "swap",
});

const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GNG Global Investment Group - Investment Firm Perth, Australia",
  description: "GNG Global Investment Group is an investment firm founded in Perth, Australia. We have strategic investments in healthcare, media, financial services, and advisory services, using our proprietary GNG Value Exchange framework.",
  openGraph: {
    title: "GNG Global Investment Group - Investment Firm Perth, Australia",
    description: "GNG Global Investment Group is an investment firm founded in Perth, Australia. Strategic investments in healthcare, media, financial services, and advisory services.",
    url: "https://gngglobal.com.au",
    siteName: "GNG Global Investment Group",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GNG Global Investment Group",
    description: "Strategic investment firm based in Perth, Australia.",
  },
  metadataBase: new URL("https://gngglobal.com.au"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} scroll-smooth`}>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
