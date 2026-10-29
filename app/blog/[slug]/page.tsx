import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { POSTS, POST_BY_SLUG } from "@/lib/posts";
import { CITY_BY_SLUG, cityUrl } from "@/lib/cities";
import SiteChrome from "@/components/SiteChrome";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = POST_BY_SLUG.get(slug);
  if (!p) return { title: "Gold Rate Blog" };
  const url = `${SITE_URL}/blog/${p.slug}/`;
  return {
    title: p.title, description: p.description,
    alternates: { canonical: url },
    openGraph: { title: p.title, description: p.description, url, siteName: SITE_NAME, type: "article" },
    twitter: { card: "summary", title: p.title, description: p.description },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const p = POST_BY_SLUG.get(slug);
  if (!p) notFound();
  const url = `${SITE_URL}/blog/${p.slug}/`;
  const cities = p.cities.map((s) => CITY_BY_SLUG.get(s)!).filter(Boolean);
  const firstPara = p.sections[0]?.paragraphs[0] ?? p.excerpt;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Article", "@id": url, url, headline: p.title, description: p.description, datePublished: p.date, author: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/` }, publisher: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/` }, mainEntityOfPage: url },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog/` },
        { "@type": "ListItem", position: 3, name: p.title, item: url },
      ] },
    ],
  };
  return (
    <SiteChrome>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="hero">
        <h1>{p.title}</h1>
        <div className="gold-bar" aria-hidden="true" />
        <p className="date-line">{p.dateLabel} · GoldRateToday</p>
        <p><strong>{firstPara}</strong></p>
      </div>
      {p.sections.map((s, i) => (
        <section className="block" key={s.heading} aria-label={s.heading}>
          {i === 0 ? null : <h2>{s.heading}</h2>}
          {(i === 0 ? s.paragraphs.slice(1) : s.paragraphs).map((para, j) => (<p key={j}>{para}</p>))}
        </section>
      ))}
      <section className="block" aria-label="Related pages">
        <h2>Related Pages</h2>
        <p className="lead">
          <a href="/">Today&apos;s gold rate in India</a> ·{" "}
          <a href={p.purity}>Today&apos;s {p.purity.includes("22") ? "22K" : p.purity.includes("24") ? "24K" : "purity"} rate</a> ·{" "}
          <a href="/gold-price-calculator/">Gold price calculator</a> ·{" "}
          {cities.map((c) => (<span key={c.slug}><a href={cityUrl(c)}>Gold rate in {c.city}</a> · </span>))}
          <a href="/blog/">All blog posts</a>
        </p>
        {p.sources.length > 0 && (
          <p className="lead">Sources: {p.sources.map((s) => (<span key={s.url}><a href={s.url}>{s.label}</a> </span>))}</p>
        )}
        <p className="date-line">Benchmark rates only, before GST and making charges. Not investment advice.</p>
      </section>
    </SiteChrome>
  );
}
