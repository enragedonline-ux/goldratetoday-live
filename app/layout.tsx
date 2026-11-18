import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Inter } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import { PopunderScript, AbsCloudPopunderScript, AraplhnPopunderScript } from "@/components/Ads";
import { PopupBanner } from "@/components/PopupBanner";
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
  title: "Gold Rate Today in India | GoldRateToday",
  description:
    "Gold rate today in India for 24K, 22K, 18K and 14K, per gram and per 10 gram, in 20 cities, with morning and evening rates and a purity guide.",
  metadataBase: new URL(SITE_URL),
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/` },
  icons: { icon: "/favicon.svg" },
  verification: { google: "RVS2OTOLGldSIvr492rvnxJ5lf4M5ZvDWVXdRHt4AjM" },
  openGraph: {
    title: "Gold Rate Today in India | GoldRateToday",
    description:
      "Gold rate today in India for 24K, 22K, 18K and 14K, per gram and per 10 gram, in 20 cities, with morning and evening rates and a purity guide.",
    url: `${SITE_URL}/`,
    siteName: "GoldRateToday",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Gold Rate Today in India | GoldRateToday",
    description:
      "Gold rate today in India for 24K, 22K, 18K and 14K, per gram and per 10 gram, in 20 cities, with morning and evening rates and a purity guide.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        {/* Google Tag Manager (added 2026-11-18 at the user's request). */}
        <Script async src="https://www.googletagmanager.com/gtm.js?id=GTM-5QXSFBMP" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());`,
          }}
        />
      </head>
      <body>
        {children}
        <PopunderScript />
        <AbsCloudPopunderScript />
        <AraplhnPopunderScript />
        <PopupBanner />
      </body>
    </html>
  );
}
