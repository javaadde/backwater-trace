import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import { SITE, siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// Instrument Serif sets headings, entry titles and guide words.
const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
// Chilanka (SMC, SIL OFL; licence beside the file) sets every Malayalam line. Self-hosted, one weight.
const malayalam = localFont({ src: "./fonts/chilanka/Chilanka-Regular.ttf", variable: "--font-malayalam", weight: "400", display: "swap", adjustFontFallback: false });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Backwater Trace — Alappuzha incident reports, traced to every source",
    template: "%s | Backwater Trace",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [...SITE.keywords],
  authors: [{ name: "Backwater Trace", url: SITE.repo }],
  creator: "Backwater Trace",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: "/",
    title: "Backwater Trace — Alappuzha, on the record",
    description: SITE.short,
  },
  twitter: {
    card: "summary_large_image",
    title: "Backwater Trace — Alappuzha, on the record",
    description: SITE.short,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  category: "civic technology",
};

export const viewport: Viewport = { themeColor: "#24428F" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${instrument.variable} ${malayalam.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
