import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// Instrument Serif sets headings, entry titles and guide words.
const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
// Chilanka (SMC, SIL OFL; licence beside the file) sets every Malayalam line. Self-hosted, one weight.
const malayalam = localFont({ src: "./fonts/chilanka/Chilanka-Regular.ttf", variable: "--font-malayalam", weight: "400", display: "swap", adjustFontFallback: false });

export const metadata: Metadata = {
  title: "Backwater Trace — Alappuzha incident reports",
  description:
    "Multilingual incident reporting and verification for Alappuzha. Group related reports, see possible conflicts, trace every claim to its source.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${instrument.variable} ${malayalam.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
