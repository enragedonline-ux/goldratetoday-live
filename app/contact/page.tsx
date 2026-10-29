import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import SiteChrome from "@/components/SiteChrome";

const TITLE = "Contact GoldRateToday";
const DESCRIPTION = "Contact GoldRateToday by email with corrections, rate questions or site feedback. We reply by email; there is no form here.";
const URL = `${SITE_URL}/contact/`;

export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_NAME, type: "website" },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": URL, url: URL, name: TITLE, description: DESCRIPTION, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/` } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Contact", item: URL },
      ] },
      { "@type": "ContactPage", url: URL, name: TITLE },
    ],
  };
  return (
    <SiteChrome>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="hero">
        <h1>Contact GoldRateToday</h1>
        <div className="gold-bar" aria-hidden="true" />
        <p>The fastest way to reach us is by email. Tell us what you noticed — a rate that looks wrong, a page that needs a correction, or an idea for a guide — and we will reply by email.</p>
        <p><a className="cta" href="mailto:enraged.online@gmail.com">Email enraged.online@gmail.com</a></p>
        <p className="date-line">There is no contact form on this page, and nothing you type here is submitted anywhere. Email is the only contact route.</p>
      </div>
      <section className="block" aria-label="Related pages">
        <h2>Related Pages</h2>
        <p className="lead"><a href="/">Today&apos;s gold rate in India</a> · <a href="/about/">About</a> · <a href="/privacy/">Privacy</a> · <a href="/blog/">Blog</a></p>
      </section>
    </SiteChrome>
  );
}
