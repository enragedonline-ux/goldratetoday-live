import type { Metadata } from "next";
import PurityPage, { type PurityConfig } from "@/components/PurityPage";
import { SITE_URL } from "@/lib/site";
import { inr } from "@/lib/rates";
import { getLiveGold } from "@/lib/live";

const config: PurityConfig = {
  "carat": "18K",
  "fineness": 750,
  "title": "18K Gold Rate Today in India: Live Price",
  "description": "18K gold rate today in India: per gram and per 10 gram benchmark, before GST and making charges. What 750 purity means.",
  "intro": [
    "18K is three-quarters pure gold. It is harder than 22K, so it is often chosen for detailed designs, stone-set pieces and lighter modern jewellery.",
    "The rate below is the national benchmark, worked out from the international spot price. Your jeweller's price will be higher once duty, premium, GST and making charges are added."
  ],
  "meaning": [
    "18K means 750 parts gold in every 1000 parts of metal. The rest is other metal, which gives the piece strength and lets the jeweller work fine detail and hold stones securely.",
    "Because a gram of 18K contains less pure gold than a gram of 22K, its per-gram rate is lower. Compare quotes only within the same purity, never across purities."
  ],
  "faqs": [
    {
      "q": "What is the 18K gold rate today in India?",
      "a": "See the rate at the top of this page for today's benchmark per gram and per 10 gram. It is a national spot-converted benchmark before GST and making charges."
    },
    {
      "q": "What does 750 mean on gold jewellery?",
      "a": "750 means 750 parts gold in every 1000 parts of metal. It is another way of writing 18K."
    },
    {
      "q": "Is 18K gold good for daily wear?",
      "a": "Yes. 18K is harder than 22K and 24K, so it holds up well for rings and stone-set pieces, though its colour is a little paler than 22K."
    },
    {
      "q": "Why is 18K cheaper per gram than 22K?",
      "a": "A gram of 18K contains less pure gold than a gram of 22K. The rate is 750 divided by 999 of the 24K rate, against 916 for 22K."
    }
  ],
  "slug": "18-carat-gold-rate-today",
  "relatedPosts": [
    {
      "href": "/blog/24k-vs-22k-vs-18k-vs-14k-which-to-buy/",
      "label": "Which purity to buy"
    }
  ]
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getLiveGold();
  const r = data.rates.find((x) => x.carat === "18K")!;
  const title = `18K Gold Rate Today: ${inr(r.perGram)}/g in India`;
  const description = `18K gold rate today in India: ${inr(r.perGram)}/g, ${inr(r.per10Gram)}/10g, benchmark before GST and making charges.`;
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
