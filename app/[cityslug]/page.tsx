import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { CITIES, CITY_BY_SLUG, cityUrl } from "@/lib/cities";
import { inr, signed, signedPct } from "@/lib/rates";
import { getLiveGold } from "@/lib/live";
import SiteChrome from "@/components/SiteChrome";

export const dynamicParams = false;

export async function generateStaticParams() {
  return CITIES.map((c) => ({ cityslug: `gold-rate-today-in-${c.slug}` }));
}

type Props = { params: Promise<{ cityslug: string }> };

function parseCity(cityslug: string) {
  const m = /^gold-rate-today-in-([a-z]+)$/.exec(cityslug);
  return m ? CITY_BY_SLUG.get(m[1]) : undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cityslug } = await params;
  const c = parseCity(cityslug);
  if (!c) return { title: "Gold Rate Today in India" };
  const data = await getLiveGold();
  const r22 = data.rates.find((r) => r.carat === "22K")!;
  const title = `Gold Rate Today in ${c.city}: 22K ${inr(r22.perGram)}/g`;
  const description = `Gold rate today in ${c.city}: 22K ${inr(r22.perGram)}/g, 24K ${inr(data.rates.find((r) => r.carat === "24K")!.perGram)}/g. Benchmark rates before GST.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}${cityUrl(c)}` },
    openGraph: { title, description, url: `${SITE_URL}${cityUrl(c)}`, siteName: SITE_NAME, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function CityPage({ params }: Props) {
  const { cityslug } = await params;
  const c = parseCity(cityslug);
  if (!c) notFound();
  const data = await getLiveGold();
  const RATES = data.rates;
  const r24 = RATES.find((r) => r.carat === "24K")!;
  const r22 = RATES.find((r) => r.carat === "22K")!;
  const neighbours = c.neighbours.map((s) => CITY_BY_SLUG.get(s)!).filter(Boolean);
  const updatedLabel = data.live
    ? `${new Date(data.updatedAt).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" })} IST`
    : data.dateLabel;
  const pageUrl = `${SITE_URL}${cityUrl(c)}`;
  const faqs = [
    { q: `What is 22 carat gold rate today in ${c.city}?`, a: `Today's benchmark 22 carat rate for ${c.city} is ${inr(r22.perGram)} per gram, or ${inr(r22.per10Gram)} per 10 gram. This is a national spot-converted benchmark before GST and making charges, not an official local rate, so your jeweller's quote in ${c.city} will be higher.` },
    { q: `What is the 24K gold rate today in ${c.city}?`, a: `Today's benchmark 24K rate for ${c.city} is ${inr(r24.perGram)} per gram, or ${inr(r24.per10Gram)} per 10 gram. 24K is fine gold, so it is usually bought as coins or bars rather than everyday jewellery.` },
    { q: `Why is my jeweller's rate in ${c.city} higher than this page?`, a: `This page converts the international spot price to INR. A jeweller adds import duty, a dealer premium, 3% GST and a making charge, and those vary by shop and by design. Ask for the full break-up before you pay, and compare the same purity and weight.` },
    { q: `What is the gold rate per 10 gram in ${c.city} today?`, a: `Per 10 gram, the benchmark is ${inr(r22.per10Gram)} for 22K and ${inr(r24.per10Gram)} for 24K. Multiply the per-gram rate by 10 to check any 10-gram quote yourself.` },
    { q: `How should I check today's gold rate in ${c.city} before buying?`, a: `Start with the purity you are buying, usually 22K for jewellery, and the exact weight. Compare the benchmark on this page with the jeweller's quote for the same purity and weight on the same day, and ask what GST and making charges are included.` },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": pageUrl, url: pageUrl, name: `Gold Rate Today in ${c.city}`, description: `Benchmark gold rate today in ${c.city} for 24K, 22K, 18K and 14K, before GST and making charges.`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/` } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Cities", item: `${SITE_URL}/gold-rate-today-cities/` },
        { "@type": "ListItem", position: 3, name: c.city, item: pageUrl },
      ] },
      { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };
  return (
    <SiteChrome>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="notice" role="note">
        <strong>{data.live ? "Live benchmark rates." : "Live feed unavailable — sample figures shown."}</strong>{" "}
        Updated {updatedLabel}. These are national spot-converted benchmark rates before import duty, GST, dealer premium and making charges — not an official local rate for {c.city}. Not investment advice.
      </div>
      <div className="hero">
        <h1>Gold Rate Today in {c.city}</h1>
        <div className="gold-bar" aria-hidden="true" />
        <p>
          Today&apos;s gold rate in {c.city} is <span className="rate">22K {inr(r22.perGram)} per gram</span> and{" "}
          <span className="rate">24K {inr(r24.perGram)} per gram</span> on the national benchmark. {c.note}
        </p>
        <p className="lead">
          Use the benchmark below to compare a jeweller&apos;s quote in {c.city}. The final bill adds GST and making charges, so it will always be higher than the metal rate alone.
        </p>
      </div>
      <section className="cards" aria-label={`Today's gold rates in ${c.city}`}>
        {RATES.map((r) => (
          <article className="card" key={r.carat}>
            <h3>{r.carat} Gold</h3>
            <p className="sub">{r.label}</p>
            <p className={r.carat === "24K" || r.carat === "22K" ? "big rate-hero" : "big"}>{inr(r.perGram)} / gram</p>
            <p className="sub"><span className="rate">{inr(r.per10Gram)} / 10 gram</span></p>
            {data.changeAvailable && (
              <p className={r.changePerGram >= 0 ? "up" : "down"}>{signed(r.changePerGram)} today ({signedPct(r.changePct)})</p>
            )}
          </article>
        ))}
      </section>
      <section className="block" aria-label="Morning and evening rates">
        <h2>Morning and Evening Rates in {c.city}</h2>
        <p className="lead">Morning is yesterday&apos;s derived close and evening is the current spot price. These are opening versus current figures, not official local sessions.</p>
        <table>
          <thead><tr><th>Session</th><th>24K / gram</th><th>22K / gram</th><th>18K / gram</th><th>14K / gram</th></tr></thead>
          <tbody>
            {data.sessions.map((s) => (
              <tr key={s.session}><td>{s.session}</td>
                <td><span className="rate">{inr(s.perGram24k)}</span></td>
                <td><span className="rate">{inr(s.perGram22k)}</span></td>
                <td><span className="rate">{inr(s.perGram18k)}</span></td>
                <td><span className="rate">{inr(s.perGram14k)}</span></td></tr>
            ))}
          </tbody>
        </table>
      </section>
      {c.slug === "kerala" && (
        <section className="block" aria-label="Kerala pavan rates">
          <h2>Kerala: 1 Pavan Gold Rate</h2>
          <p className="lead">One pavan is 8 grams, the traditional unit used for gold in Kerala. The table below is the same benchmark, worked out for 8 grams.</p>
          <table>
            <thead><tr><th>Weight</th><th>22K</th><th>24K</th></tr></thead>
            <tbody>
              <tr><td>1 pavan (8 gram)</td><td><span className="rate">{inr(r22.perGram * 8)}</span></td><td><span className="rate">{inr(r24.perGram * 8)}</span></td></tr>
              <tr><td>1 gram</td><td><span className="rate">{inr(r22.perGram)}</span></td><td><span className="rate">{inr(r24.perGram)}</span></td></tr>
              <tr><td>10 gram</td><td><span className="rate">{inr(r22.per10Gram)}</span></td><td><span className="rate">{inr(r24.per10Gram)}</span></td></tr>
            </tbody>
          </table>
          <p className="date-line">Benchmark only, before GST and making charges. See the pavan explainer in the blog.</p>
        </section>
      )}
      <section className="block faq" aria-label="Frequently asked questions">
        <h2>Common Questions</h2>
        {faqs.map((f) => (
          <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
        ))}
      </section>
      <section className="block" aria-label="Related pages">
        <h2>Related Pages</h2>
        <p className="lead">
          <a href="/">Today&apos;s gold rate in India</a> ·{" "}
          <a href="/gold-rate-today-cities/">All cities</a> ·{" "}
          {neighbours.map((n) => (<span key={n.slug}><a href={cityUrl(n)}>Gold rate in {n.city}</a> · </span>))}
          <a href="/24-carat-gold-rate-today/">24K rate</a> ·{" "}
          <a href="/22-carat-gold-rate-today/">22K rate</a> ·{" "}
          <a href="/18-carat-gold-rate-today/">18K rate</a> ·{" "}
          <a href="/gold-price-calculator/">Gold price calculator</a> ·{" "}
          <a href="/blog/">Blog</a>
        </p>
        <p className="lead">
          Sister site: <a href="https://goldratetoday.online/">goldratetoday.online</a> — live gold, silver and crypto prices.
        </p>
      </section>
    </SiteChrome>
  );
}
