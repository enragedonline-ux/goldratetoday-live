import { SITE_URL } from "@/lib/site";
import { CITIES, cityUrl } from "@/lib/cities";
import { POSTS } from "@/lib/posts";

export function GET(): Response {
  const lines: string[] = [
    "# GoldRateToday — goldratetoday.live",
    "",
    "GoldRateToday shows today's gold rate in India for 24K, 22K, 18K and 14K, as a national spot-converted benchmark before import duty, GST, dealer premium and making charges. Rates are not an official local rate for any city, and nothing here is investment advice.",
    "",
    "## Pages",
    "",
    `- [Gold Rate Today in India](${SITE_URL}/): Today's 24K, 22K, 18K and 14K benchmark rates, morning and evening rates, and a purity guide.`,
    `- [Gold Price Calculator](${SITE_URL}/gold-price-calculator/): Work out metal cost, making charge, 3% GST and total payable for any weight and purity.`,
    `- [Gold Rate in Indian Cities](${SITE_URL}/gold-rate-today-cities/): All 20 city pages, grouped into major cities and more cities.`,
    ...CITIES.map((c) => `- [Gold Rate Today in ${c.city}](${SITE_URL}${cityUrl(c)}): Benchmark 22K and 24K rates for ${c.city}, ${c.state}, with morning and evening rates and city FAQs.`),
    `- [24K Gold Rate Today](${SITE_URL}/24-carat-gold-rate-today/): 24K fine gold rate per gram, per 8 gram and per 10 gram.`,
    `- [22K Gold Rate Today](${SITE_URL}/22-carat-gold-rate-today/): 22K 916 hallmark gold rate per gram, per 8 gram and per 10 gram.`,
    `- [18K Gold Rate Today](${SITE_URL}/18-carat-gold-rate-today/): 18K 750 gold rate per gram, per 8 gram and per 10 gram.`,
    `- [14K Gold Rate Today](${SITE_URL}/14-carat-gold-rate-today/): 14K 585 gold rate per gram, per 8 gram and per 10 gram.`,
    `- [Gold Rate History](${SITE_URL}/gold-rate-history/): Yesterday vs today rates and a 7-day 24K table.`,
    `- [About GoldRateToday](${SITE_URL}/about/): How the benchmark rates are worked out and what they do not cover.`,
    `- [Privacy Policy](${SITE_URL}/privacy/): What the site collects, and how cookies and advertising work.`,
    `- [Contact GoldRateToday](${SITE_URL}/contact/): Email contact only.`,
    `- [Gold Rate Blog](${SITE_URL}/blog/): Simple guides to gold rates, purity, hallmark, GST and price units.`,
    ...POSTS.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}/): ${p.excerpt}`),
    "",
    "## Optional",
    "",
    `- [Sitemap](${SITE_URL}/sitemap.xml): Full list of pages on this site.`,
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
