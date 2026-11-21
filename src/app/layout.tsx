import type { Metadata } from "next";
import { Geist, Noto_Sans_Malayalam } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const malayalam = Noto_Sans_Malayalam({ variable: "--font-malayalam", subsets: ["malayalam"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "Backwater Trace — Alappuzha incident reports",
  description:
    "Multilingual incident reporting and verification for Alappuzha. Group related reports, see possible conflicts, trace every claim to its source.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${malayalam.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
