import type { Metadata } from "next";
import { Antonio, Geist, Geist_Mono, Noto_Sans_Malayalam } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const antonio = Antonio({ variable: "--font-antonio", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const malayalam = Noto_Sans_Malayalam({ variable: "--font-malayalam", subsets: ["malayalam"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "Backwater Trace — Alappuzha incident reports",
  description:
    "Multilingual incident reporting and verification for Alappuzha. Group related reports, see possible conflicts, trace every claim to its source.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${malayalam.variable} ${antonio.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
