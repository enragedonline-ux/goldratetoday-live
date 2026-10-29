import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { POSTS } from "@/lib/posts";
import SiteChrome from "@/components/SiteChrome";

const TITLE = "Gold Rate Blog: Guides for Indian Buyers";
const DESCRIPTION = "Simple guides to gold rates in India: purity, hallmark, GST, pavan, tola and why prices move. No jargon, no advice, just clear answers.";
const URL = `${SITE_URL}/blog/`;

export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_NAME, type: "website" },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

export default function BlogIndex() {
  const sorted = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": URL, url: URL, name: TITLE, description: DESCRIPTION, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/` } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: URL },
      ] },
      { "@type": "Blog", name: TITLE, url: URL, blogPost: sorted.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: `${SITE_URL}/blog/${p.slug}/`, datePublished: p.date })) },
    ],
  };
  return (
    <SiteChrome>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="hero">
        <h1>Gold Rate Blog</h1>
        <div className="gold-bar" aria-hidden="true" />
        <p>Short, plain guides to buying gold in India: what purity means, how your bill is built, and why the rate moves. Every guide starts with the direct answer, then explains it.</p>
      </div>
      <section className="block" aria-label="Blog posts">
        {sorted.map((p) => (
          <article key={p.slug} style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 22 }}><a href={`/blog/${p.slug}/`}>{p.title}</a></h2>
            <p className="date-line">{p.dateLabel}</p>
            <p>{p.excerpt}</p>
          </article>
        ))}
      </section>
    </SiteChrome>
  );
}
