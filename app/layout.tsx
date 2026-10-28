import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gold Rate Today: 24K ₹14,230/g in India",
  description:
    "Gold rate in India today for 24K, 22K, 18K and 14K, per gram and per 10 gram, with morning and evening rates and a purity guide.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: `${SITE_URL}/` },
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Gold Rate Today: 24K ₹14,230/g in India",
    description:
      "Gold rate in India today for 24K, 22K, 18K and 14K, per gram and per 10 gram, with morning and evening rates and a purity guide.",
    url: `${SITE_URL}/`,
    siteName: "GoldRateToday",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Gold Rate Today: 24K ₹14,230/g in India",
    description:
      "Gold rate in India today for 24K, 22K, 18K and 14K, per gram and per 10 gram, with morning and evening rates and a purity guide.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
