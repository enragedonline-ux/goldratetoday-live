import type { Metadata } from "next";
import PurityPage, { type PurityConfig } from "@/components/PurityPage";
import { SITE_URL } from "@/lib/site";
import { inr } from "@/lib/rates";
import { getLiveGold } from "@/lib/live";

const config: PurityConfig = {
  "carat": "14K",
  "fineness": 585,
  "title": "14K Gold Rate Today in India: Live Price",
  "description": "14K gold rate today in India: per gram and per 10 gram benchmark, before GST and making charges. What 585 means.",
  "intro": [
    "14K is just over half pure gold. It is the hardest of the four purities on this site, and usually the lowest priced per gram.",
    "The rate below is the national benchmark, worked out from the international spot price. Your jeweller's price will be higher once duty, premium, GST and making charges are added."
  ],
  "meaning": [
    "14K means 585 parts gold in every 1000 parts of metal. The larger share of other metal makes it tough and resistant to wear, which suits light, everyday pieces.",
    "Buyers who want a lower price per gram, or a piece that will take hard daily use, often choose 14K. Check the 585 mark and the weight before you pay."
  ],
  "faqs": [
    {
      "q": "What is the 14K gold rate today in India?",
      "a": "See the rate at the top of this page for today's benchmark per gram and per 10 gram. It is a national spot-converted benchmark before GST and making charges."
    },
    {
      "q": "What does 585 mean on gold jewellery?",
      "a": "585 means 585 parts gold in every 1000 parts of metal. It is another way of writing 14K."
    },
    {
      "q": "Is 14K gold real gold?",
      "a": "Yes. 14K is a recognised gold purity, just with a lower gold share than 22K or 18K. That is why its per-gram rate is lower."
    },
    {
      "q": "When does 14K make sense?",
      "a": "When you want a hard-wearing, lower-priced piece for daily use, or when the design matters more than the gold weight. For wedding jewellery, most Indian buyers still choose 22K."
    }
  ],
  "slug": "14-carat-gold-rate-today",
  "relatedPosts": [
    {
      "href": "/blog/24k-vs-22k-vs-18k-vs-14k-which-to-buy/",
      "label": "Which purity to buy"
    }
  ]
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getLiveGold();
  const r = data.rates.find((x) => x.carat === "14K")!;
  const title = `14K Gold Rate Today: ${inr(r.perGram)}/g in India`;
  const description = `14K gold rate today in India: ${inr(r.perGram)}/g, ${inr(r.per10Gram)}/10g, benchmark before GST and making charges.`;
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
