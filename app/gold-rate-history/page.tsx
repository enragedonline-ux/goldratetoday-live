import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { inr, signed } from "@/lib/rates";
import { getLiveGold } from "@/lib/live";
import SiteChrome from "@/components/SiteChrome";

const TITLE = "Gold Rate History: Yesterday vs Today";
const DESCRIPTION = "Gold rate history: how yesterday's rate compares with today, what the 7-day table shows, and why history is approximate.";
const URL = `${SITE_URL}/gold-rate-history/`;

export async function generateMetadata(): Promise<Metadata> {

  return {
    title: TITLE, description: DESCRIPTION,
    alternates: { canonical: URL },
    openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_NAME, type: "website" },
    twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
  };
}

export default async function HistoryPage() {
  const data = await getLiveGold();
  const r24 = data.rates.find((r) => r.carat === "24K")!;
  const r22 = data.rates.find((r) => r.carat === "22K")!;
  const updatedLabel = data.live
    ? `${new Date(data.updatedAt).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" })} IST`
    : data.dateLabel;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": URL, url: URL, name: TITLE, description: DESCRIPTION, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/` } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Rate History", item: URL },
      ] },
    ],
  };
  return (
    <SiteChrome>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="notice" role="note">
        <strong>{data.live ? "Live benchmark rates." : "Live feed unavailable — sample figures shown."}</strong>{" "}
        Updated {updatedLabel}. National spot-converted benchmark before GST and making charges. Not investment advice.
      </div>
      <div className="hero">
        <h1>Gold Rate History: Yesterday vs Today</h1>
        <div className="gold-bar" aria-hidden="true" />
        <p>Today&apos;s 24K benchmark is <span className="rate">{inr(r24.perGram)} per gram</span>, against yesterday&apos;s{" "}
          <span className="rate">{inr(r24.yesterdayPerGram)} per gram</span>. For 22K, today is{" "}
          <span className="rate">{inr(r22.perGram)} per gram</span>, against yesterday&apos;s{" "}
          <span className="rate">{inr(r22.yesterdayPerGram)} per gram</span>.</p>
        <p>Yesterday&apos;s figure here is derived from the last 24 hours of spot movement, not from a jeweller&apos;s closing rate. It answers one question well — did gold rise or fall since yesterday? — and it should not be treated as an exact historical shop price.</p>
      </div>
      <section className="block" aria-label="Yesterday versus today">
        <h2>Yesterday vs Today</h2>
        <table>
          <thead><tr><th>Purity</th><th>Yesterday / gram</th><th>Today / gram</th><th>Change / gram</th></tr></thead>
          <tbody>
            {data.rates.map((r) => (
              <tr key={r.carat}><td>{r.carat}</td>
                <td><span className="rate">{inr(r.yesterdayPerGram)}</span></td>
                <td><span className="rate">{inr(r.perGram)}</span></td>
                <td>{data.changeAvailable ? signed(r.changePerGram) : "—"}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="lead">A small daily move is normal. A week of moves in the same direction tells you more than any single day.</p>
      </section>
      <section className="block" aria-label="Last 7 days">
        <h2>Last 7 Days: 24K Gold</h2>
        {data.historyAvailable && data.history7 ? (
          <table>
            <thead><tr><th>Date</th><th>24K / gram</th><th>24K / 10 gram</th><th>Change / gram</th></tr></thead>
            <tbody>
              {data.history7.map((row) => (
                <tr key={row.date}><td>{row.date}</td>
                  <td><span className="rate">{inr(row.perGram24k)}</span></td>
                  <td><span className="rate">{inr(row.perGram24k * 10)}</span></td>
                  <td>{row.changePerGram === null ? "—" : signed(row.changePerGram)}</td></tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="date-line">7-day history is unavailable right now. The table will return once the price history feed is available again.</p>
        )}
        <p className="lead">History prices are converted with the current dollar-to-rupee rate, so they are approximate, not exact historical INR rates. Use them to see the trend, not to settle an old bill.</p>
      </section>
      <section className="block" aria-label="Related pages">
        <h2>Related Pages</h2>
        <p className="lead"><a href="/">Today&apos;s gold rate in India</a> · <a href="/gold-rate-today-cities/">All cities</a> · <a href="/gold-price-calculator/">Gold price calculator</a> · <a href="/blog/why-gold-rate-increasing-today/">Why the gold rate moves</a></p>
      </section>
    </SiteChrome>
  );
}
