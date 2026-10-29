import type { Metadata } from "next";
import PurityPage, { type PurityConfig } from "@/components/PurityPage";
import { SITE_URL } from "@/lib/site";

const config: PurityConfig = {
  "carat": "22K",
  "fineness": 916,
  "title": "22K Gold Rate Today in India: 916 Price",
  "description": "22K gold rate today in India: 916 hallmark price per gram and per 10 gram, benchmark before GST and making charges.",
  "intro": [
    "22K is the purity most jewellery in India is made in. It is strong enough for daily wear, and it is the purity behind the 916 hallmark you see stamped on jewellery.",
    "The rate below is the national benchmark, worked out from the international spot price. Your jeweller's price will be higher once duty, premium, GST and making charges are added."
  ],
  "meaning": [
    "22K means 916 parts gold in every 1000 parts of metal. The other 84 parts are usually copper or silver, added to make the gold harder and easier to shape. That is why the hallmark reads 916.",
    "When you buy, check three things: the 916 mark, the weight in grams, and the full break-up of metal cost, making charge and GST. Those three tell you whether the quote is fair, whatever the shop."
  ],
  "faqs": [
    {
      "q": "What is the 22K gold rate today in India?",
      "a": "See the rate at the top of this page for today's benchmark per gram and per 10 gram. It is a national spot-converted benchmark before GST and making charges."
    },
    {
      "q": "What does 916 mean on gold jewellery?",
      "a": "916 means 916 parts gold in every 1000 parts of metal. It is another way of writing 22K, and it is the hallmark that shows the piece has been checked for purity."
    },
    {
      "q": "Is 22K better than 24K for jewellery?",
      "a": "For jewellery, yes for most buyers. 22K is harder and holds its shape better, while 24K is too soft for daily wear. For coins and bars, 24K is the usual choice."
    },
    {
      "q": "How do I check a 22K quote from a jeweller?",
      "a": "Multiply the per-gram benchmark by your weight, then ask the jeweller to show metal cost, making charge and GST separately. If the total is far above the benchmark plus those items, ask why."
    }
  ],
  "slug": "22-carat-gold-rate-today",
  "relatedPosts": [
    {
      "href": "/blog/916-hallmark-explained/",
      "label": "916 hallmark explained"
    }
  ]
};

export const metadata: Metadata = {
  title: config.title, description: config.description,
  alternates: { canonical: `${SITE_URL}/${config.slug}/` },
  openGraph: { title: config.title, description: config.description, url: `${SITE_URL}/${config.slug}/`, siteName: "GoldRateToday", type: "website" },
  twitter: { card: "summary", title: config.title, description: config.description },
};

export default function Page() {
  return <PurityPage config={config} />;
}
