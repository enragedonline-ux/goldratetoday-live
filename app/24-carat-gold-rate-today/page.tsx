import type { Metadata } from "next";
import PurityPage, { type PurityConfig } from "@/components/PurityPage";
import { SITE_URL } from "@/lib/site";
import { inr } from "@/lib/rates";
import { getLiveGold } from "@/lib/live";

const config: PurityConfig = {
  "carat": "24K",
  "fineness": 999,
  "title": "24K Gold Rate Today in India: Live Price",
  "description": "24K gold rate today in India: per gram and per 10 gram benchmark, morning and evening rates, before GST and making charges.",
  "intro": [
    "24K is fine gold, the purest form sold in India. Because it is soft, it is mostly bought as coins and bars, or for investment-style purchases, rather than everyday jewellery.",
    "The rate below is the national benchmark, worked out from the international spot price. Your jeweller's price will be higher once duty, premium, GST and making charges are added."
  ],
  "meaning": [
    "24K means 999 parts gold in every 1000 parts of metal, with almost no other metal mixed in. That purity is why it is soft and easy to dent, and why jewellers rarely use it for rings or chains that get daily wear.",
    "If you are buying for a wedding or for daily wear, most buyers in India choose 22K instead. If you are buying a coin or bar to hold, 24K is the usual choice, and the hallmark and weight matter more than the design."
  ],
  "faqs": [
    {
      "q": "What is the 24K gold rate today in India?",
      "a": "See the rate at the top of this page for today's benchmark per gram and per 10 gram. It is a national spot-converted benchmark before GST and making charges."
    },
    {
      "q": "Is 24K gold good for jewellery?",
      "a": "24K is very pure but soft, so it scratches and bends more easily than 22K or 18K. It is best for coins and bars; for jewellery you wear every day, 22K is stronger."
    },
    {
      "q": "Why is 24K more expensive per gram than 22K?",
      "a": "A gram of 24K contains more pure gold than a gram of 22K, so its metal value is higher. The per-gram rate for 22K is 916 divided by 999 of the 24K rate."
    },
    {
      "q": "Does the 24K rate include GST?",
      "a": "No. The rate here is the metal rate only. GST at 3% and any making charge are added by the jeweller on top."
    }
  ],
  "slug": "24-carat-gold-rate-today",
  "relatedPosts": [
    {
      "href": "/blog/24k-vs-22k-vs-18k-vs-14k-which-to-buy/",
      "label": "Which purity to buy"
    }
  ]
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getLiveGold();
  const r = data.rates.find((x) => x.carat === "24K")!;
  const title = `24K Gold Rate Today: ${inr(r.perGram)}/g in India`;
  const description = `24K gold rate today in India: ${inr(r.perGram)}/g, ${inr(r.per10Gram)}/10g, benchmark before GST and making charges.`;
  return {
    title, description,
    alternates: { canonical: `${SITE_URL}/${config.slug}/` },
    openGraph: { title, description, url: `${SITE_URL}/${config.slug}/`, siteName: "GoldRateToday", type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default function Page() {
  return <PurityPage config={config} />;
}
