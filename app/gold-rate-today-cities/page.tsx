import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { CITIES, cityUrl } from "@/lib/cities";
import SiteChrome from "@/components/SiteChrome";

const TITLE = "Gold Rate in Indian Cities: 22K, 24K Today";
const DESCRIPTION = "Gold rate today in 20 Indian cities, from Bangalore to Kerala. Open a city for its 22K and 24K benchmark rates, before GST.";
const URL = `${SITE_URL}/gold-rate-today-cities/`;

export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_NAME, type: "website" },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

export default function CitiesHub() {
  const tier1 = CITIES.filter((c) => c.tier === 1);
  const tier2 = CITIES.filter((c) => c.tier === 2);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": URL, url: URL, name: TITLE, description: DESCRIPTION, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/` } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Cities", item: URL },
      ] },
    ],
  };
  const group = (label: string, list: typeof CITIES) => (
    <>
      <h2>{label}</h2>
      <div className="city-grid">
        {list.map((c) => (
          <article className="city-card" key={c.slug}>
            <h3><a href={cityUrl(c)}>Gold Rate in {c.city}</a></h3>
            <p>{c.state}</p>
            <p>{c.note}</p>
          </article>
        ))}
      </div>
    </>
  );
  return (
    <SiteChrome>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="hero">
        <h1>Gold Rate in Indian Cities</h1>
        <div className="gold-bar" aria-hidden="true" />
        <p>Pick a city below for today&apos;s 22K and 24K benchmark rates, morning and evening rates, and answers to the questions buyers in that city ask most. Every city page uses the same national spot-converted benchmark, before GST and making charges — not an official local rate.</p>
      </div>
      <section className="block" aria-label="Tier 1 cities">{group("Major Cities", tier1)}</section>
      <section className="block" aria-label="Tier 2 cities">{group("More Cities", tier2)}</section>
      <section className="block" aria-label="Related pages">
        <h2>Related Pages</h2>
        <p className="lead"><a href="/">Today&apos;s gold rate in India</a> · <a href="/gold-price-calculator/">Gold price calculator</a> · <a href="/blog/">Blog</a></p>
      </section>
    </SiteChrome>
  );
}
