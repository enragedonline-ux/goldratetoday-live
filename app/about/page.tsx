import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import SiteChrome from "@/components/SiteChrome";

const TITLE = "About GoldRateToday: Gold Rates in India";
const DESCRIPTION = "About GoldRateToday: how our India gold rates are worked out from the international spot price, and what they do and do not cover.";
const URL = `${SITE_URL}/about/`;

export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_NAME, type: "website" },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": URL, url: URL, name: TITLE, description: DESCRIPTION, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/` } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "About", item: URL },
      ] },
    ],
  };
  return (
    <SiteChrome>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="hero">
        <h1>About GoldRateToday</h1>
        <div className="gold-bar" aria-hidden="true" />
        <p>GoldRateToday is a simple gold-rate site for India. It shows today&apos;s benchmark rate for 24K, 22K, 18K and 14K gold, city pages for the places readers search for most, a price calculator, and short guides that explain purity, hallmarking, GST and making charges in plain language.</p>
      </div>
      <section className="block" aria-label="How the rates are worked out">
        <h2>How the Rates Are Worked Out</h2>
        <p>The rate starts with the international gold spot price in US dollars per troy ounce. That figure is converted to rupees using the current dollar-to-rupee rate, then divided by 31.1034768, the number of grams in a troy ounce, to give a per-gram rate for 24K gold. Every other purity is derived from that 24K base: 22K is 916 divided by 999 of it, 18K is 750 divided by 999, and 14K is 585 divided by 999. Because every purity comes from the same base, the purities can never drift out of step with each other.</p>
        <p>Rates refresh about once a minute while the feeds are available. If a feed fails, the site falls back to a dated set of figures and says so clearly at the top of the page, rather than presenting old figures as today&apos;s price.</p>
      </section>
      <section className="block" aria-label="What the rates are not">
        <h2>What the Rates Are Not</h2>
        <p>The rates on this site are a national benchmark. They are not an official local rate for any city, they are not a jeweller&apos;s selling price, and they are not a promise of the price you will pay. A jeweller adds import duty, a dealer premium, 3% GST and a making charge, so the price in a shop will always be higher. The site has no connection with any rate-setting body and makes no claim of affiliation with one.</p>
        <p>Nothing on this site is investment advice. Gold prices move every day, and a rate shown here is a reference for comparing quotes, not a recommendation to buy or sell.</p>
      </section>
      <section className="block" aria-label="Related pages">
        <h2>Related Pages</h2>
        <p className="lead"><a href="/">Today&apos;s gold rate in India</a> · <a href="/gold-rate-today-cities/">All cities</a> · <a href="/gold-price-calculator/">Gold price calculator</a> · <a href="/blog/">Blog</a> · <a href="/contact/">Contact</a> · <a href="/privacy/">Privacy</a></p>
      </section>
    </SiteChrome>
  );
}
