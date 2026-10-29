import { SITE_URL, SITE_NAME } from "@/lib/site";
import { inr, signed, signedPct } from "@/lib/rates";
import { getLiveGold } from "@/lib/live";
import SiteChrome from "@/components/SiteChrome";

export type PurityConfig = {
  carat: string;
  fineness: number;
  slug: string;
  title: string;
  description: string;
  intro: string[];
  meaning: string[];
  faqs: { q: string; a: string }[];
  relatedPosts: { href: string; label: string }[];
};

export default async function PurityPage({ config }: { config: PurityConfig }) {
  const data = await getLiveGold();
  const r = data.rates.find((x) => x.carat === config.carat)!;
  const url = `${SITE_URL}/${config.slug}/`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": url, url, name: config.title, description: config.description, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/` } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: `${config.carat} Gold Rate`, item: url },
      ] },
      { "@type": "FAQPage", mainEntity: config.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };
  const updatedLabel = data.live
    ? `${new Date(data.updatedAt).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" })} IST`
    : data.dateLabel;
  return (
    <SiteChrome>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="notice" role="note">
        <strong>{data.live ? "Live benchmark rates." : "Live feed unavailable — sample figures shown."}</strong>{" "}
        Updated {updatedLabel}. National spot-converted benchmark before import duty, GST, dealer premium and making charges. Not investment advice.
      </div>
      <div className="hero">
        <h1>{config.carat} Gold Rate Today in India</h1>
        <div className="gold-bar" aria-hidden="true" />
        <p>Today&apos;s {config.carat} gold rate is <span className="rate">{inr(r.perGram)} per gram</span> and{" "}
          <span className="rate">{inr(r.per10Gram)} per 10 gram</span> on the national benchmark.</p>
        {config.intro.map((p, i) => (<p key={i}>{p}</p>))}
      </div>
      <section className="block" aria-label={`${config.carat} rate table`}>
        <h2>{config.carat} Rate by Weight</h2>
        <table>
          <thead><tr><th>Weight</th><th>{config.carat} rate</th></tr></thead>
          <tbody>
            <tr><td>1 gram</td><td><span className="rate">{inr(r.perGram)}</span></td></tr>
            <tr><td>8 gram</td><td><span className="rate">{inr(r.perGram * 8)}</span></td></tr>
            <tr><td>10 gram</td><td><span className="rate">{inr(r.per10Gram)}</span></td></tr>
          </tbody>
        </table>
        {data.changeAvailable && (
          <p className="date-line">Yesterday: {inr(r.yesterdayPerGram)} per gram · Change today: <span className={r.changePerGram >= 0 ? "up" : "down"}>{signed(r.changePerGram)} ({signedPct(r.changePct)})</span></p>
        )}
      </section>
      <section className="block" aria-label={`What ${config.carat} means`}>
        <h2>What {config.carat} Means</h2>
        {config.meaning.map((p, i) => (<p key={i}>{p}</p>))}
        <p className="lead">Fineness: {config.fineness} parts gold in every 1000 parts of metal.</p>
      </section>
      <section className="block faq" aria-label="Frequently asked questions">
        <h2>Common Questions</h2>
        {config.faqs.map((f) => (
          <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
        ))}
      </section>
      <section className="block" aria-label="Related pages">
        <h2>Related Pages</h2>
        <p className="lead">
          <a href="/">Today&apos;s gold rate in India</a> ·{" "}
          <a href="/gold-rate-today-cities/">All cities</a> ·{" "}
          <a href="/gold-price-calculator/">Gold price calculator</a> ·{" "}
          <a href="/blog/">Blog</a> ·{" "}
          {config.relatedPosts.map((p) => (<span key={p.href}><a href={p.href}>{p.label}</a> · </span>))}
          <a href="/24-carat-gold-rate-today/">24K rate</a> ·{" "}
          <a href="/22-carat-gold-rate-today/">22K rate</a>
        </p>
      </section>
    </SiteChrome>
  );
}
