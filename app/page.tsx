import type { Metadata } from "next";
import Image from "next/image";
import { SITE_URL, SITE_NAME, TAGLINE } from "@/lib/site";
import { TIER_1_CITIES, inr, signed, signedPct } from "@/lib/rates";
import { getLiveGold } from "@/lib/live";

const DESCRIPTION =
  "Gold rate in India today for 24K, 22K, 18K and 14K, per gram and per 10 gram, with morning and evening rates and a purity guide.";

const FAQS = [
  {
    q: "What is the difference between 24K and 22K gold?",
    a: "24K gold is the purest form, with almost no other metal mixed in. It is soft, so it is rarely used for everyday jewellery. 22K gold mixes a small amount of other metal into the gold, which makes it stronger and easier to shape. That is why most jewellery in India is made in 22K.",
  },
  {
    q: "What does 916 mean on gold jewellery?",
    a: "916 means 916 parts of gold in every 1000 parts of the metal. In simple terms, it is another way of writing 22K. When you see a 916 hallmark, it tells you the piece is 22 carat gold that has been checked for purity.",
  },
  {
    q: "Do the rates on this page include GST and making charges?",
    a: "No. The rates shown here are the metal rate only, before GST and before making charges. A jeweller adds GST, currently 3 percent, plus a making charge that depends on the design. The final bill is always higher than the metal rate alone, so ask for the full break-up before you pay.",
  },
  {
    q: "How should I check today's gold rate before buying?",
    a: "Start with the rate for the exact purity you are buying, for example 22K, and for the exact weight, for example per gram or per 10 gram. Then compare that figure with the rate your local jeweller quotes for the same purity and weight on the same day. If the two figures are far apart, ask what is included in the jeweller's figure before you decide.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const data = await getLiveGold();
  const rate24 = data.rates.find((r) => r.carat === "24K")!;
  // Title stays within 60 chars (verified: 39 chars at Rs 12,379/g).
  const title = `Gold Rate Today: 24K ${inr(rate24.perGram)}/g in India`;
  return {
    title,
    description: DESCRIPTION,
    alternates: { canonical: `${SITE_URL}/` },
    openGraph: {
      title,
      description: DESCRIPTION,
      url: `${SITE_URL}/`,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: { card: "summary", title, description: DESCRIPTION },
  };
}

export default async function HomePage() {
  const data = await getLiveGold();
  const RATES = data.rates;
  const rate24 = RATES.find((r) => r.carat === "24K")!;
  const rate22 = RATES.find((r) => r.carat === "22K")!;

  const updatedLabel = data.live
    ? `${new Date(data.updatedAt).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      })} IST`
    : data.dateLabel;

  const sourceLine = data.live
    ? `Source: gold spot from gold-api.com (XAU $${(data.xauUsd as number).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per ounce) and USD to INR from ${data.fxSource} (${(data.usdInr as number).toLocaleString("en-IN", { maximumFractionDigits: 4 })} per $1).`
    : "Live spot and currency feeds are unavailable right now, so the figures below are a dated sample set, not today's price.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/`,
        url: `${SITE_URL}/`,
        name: "Gold Rate Today in India",
        description: DESCRIPTION,
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  const historyLow =
    data.history7 && data.history7.length
      ? Math.min(...data.history7.map((r) => r.perGram24k))
      : null;
  const historyHigh =
    data.history7 && data.history7.length
      ? Math.max(...data.history7.map((r) => r.perGram24k))
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="header">
        <div className="header-inner">
          <a className="brand" href="/" aria-label="GoldRateToday home">
            <Image src="/logo.svg" alt="GoldRateToday logo" width={160} height={48} priority />
          </a>
          <nav className="nav" aria-label="Main navigation">
            <a href="#top">Home</a>
            <a href="#rates">Gold Rate Today</a>
            <a href="#rates">24K</a>
            <a href="#rates">22K</a>
            <a href="#rates">18K</a>
            <a href="/gold-price-calculator/">Calculator</a>
          </nav>
        </div>
      </header>

      <main className="wrap" id="top">
        <div className="notice" role="note">
          {data.live ? (
            <>
              <strong>Live rates.</strong> Updated {updatedLabel}.{" "}
              {sourceLine} International spot price converted to INR. This
              is a benchmark before import duty, GST, dealer premium and
              making charges — your local jeweller&apos;s rate will be
              higher. Not investment advice.
            </>
          ) : (
            <>
              <strong>Live feed unavailable — sample figures shown.</strong>{" "}
              {sourceLine} Do not use these figures as today&apos;s price.
            </>
          )}
        </div>

        <div className="hero">
          <h1>Gold Rate Today in India</h1>
          <p>
            {SITE_NAME} shows {TAGLINE}. Check the rate for the purity and
            weight you actually plan to buy, then compare it with your local
            jeweller before you pay.
          </p>
          <p className="date-line">
            {data.live ? (
              <>Updated <strong>{updatedLabel}</strong></>
            ) : (
              <>Sample rates for <strong>{data.dateLabel}</strong></>
            )}{" "}
            · <span className="rate">24K {inr(rate24.perGram)} per gram</span> · <span className="rate">22K {inr(rate22.perGram)} per gram</span>
          </p>
        </div>

        <section className="cards" id="rates" aria-label="Today's gold rates">
          {RATES.map((r) => (
            <article className="card" key={r.carat}>
              <h3>{r.carat} Gold</h3>
              <p className="sub">{r.label}</p>
              <p className={r.carat === "24K" || r.carat === "22K" ? "big rate-hero" : "big"}>{inr(r.perGram)} / gram</p>
              <p className="sub"><span className="rate">{inr(r.per10Gram)} / 10 gram</span></p>
              {data.changeAvailable ? (
                <>
                  <p className={r.changePerGram >= 0 ? "up" : "down"}>
                    {signed(r.changePerGram)} today ({signedPct(r.changePct)})
                  </p>
                  <p className="sub">
                    Yesterday: <span className="rate">{inr(r.yesterdayPerGram)} / gram</span>
                  </p>
                </>
              ) : (
                <p className="sub">24h change unavailable</p>
              )}
            </article>
          ))}
        </section>

        <section className="block" id="am-pm" aria-label="Morning and evening rates">
          <h2>Morning and Evening Rates</h2>
          <p className="lead">
            {data.sessions.length > 1 ? (
              <>
                Morning is yesterday&apos;s derived close and evening is the
                current spot price. These are opening versus current
                figures, not official IBJA sessions. A small move between
                the two is normal.
              </>
            ) : (
              <>
                Evening is the current spot price. Yesterday&apos;s close is
                unavailable right now, so no morning row is shown.
              </>
            )}
          </p>
          <table>
            <thead>
              <tr>
                <th>Session</th>
                <th>24K / gram</th>
                <th>22K / gram</th>
                <th>18K / gram</th>
                <th>14K / gram</th>
              </tr>
            </thead>
            <tbody>
              {data.sessions.map((s) => (
                <tr key={s.session}>
                  <td>{s.session}</td>
                  <td><span className="rate">{inr(s.perGram24k)}</span></td>
                  <td><span className="rate">{inr(s.perGram22k)}</span></td>
                  <td><span className="rate">{inr(s.perGram18k)}</span></td>
                  <td><span className="rate">{inr(s.perGram14k)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="date-line">
            {data.live
              ? "Spot benchmark, before GST and making charges. See the note at the top of the page."
              : `Sample figures for ${data.dateLabel}, before GST and making charges.`}
          </p>
        </section>

        <section className="block" id="cities" aria-label="Major cities">
          <h2>Gold Rate in Major Cities</h2>
          <p className="lead">
            These are the cities readers search for most often. Each card
            shows the same national {data.live ? "live" : "sample"} base for
            now. Separate city pages will follow in the next phase.
          </p>
          <div className="city-grid">
            {TIER_1_CITIES.map((c) => (
              <article className="city-card" key={c.city}>
                <h3>{c.city}</h3>
                <p>{c.state}</p>
                <p><span className="rate">24K: {inr(rate24.perGram)} / gram</span></p>
                <p><span className="rate">22K: {inr(rate22.perGram)} / gram</span></p>
                <p className="soon">City page coming in the next phase</p>
              </article>
            ))}
          </div>
        </section>

        <section className="block" id="history" aria-label="Recent history">
          <h2>Last 7 Days: 24K Gold</h2>
          <p className="lead">
            A short look back helps you see whether today&apos;s move is
            unusual or part of a steady drift. The change column is measured
            against the previous day in the table. History prices are
            converted with the current USD to INR rate, so they are
            approximate, not exact historical INR rates.
          </p>
          {data.historyAvailable && data.history7 ? (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>24K / gram</th>
                    <th>24K / 10 gram</th>
                    <th>Change / gram</th>
                  </tr>
                </thead>
                <tbody>
                  {data.history7.map((row) => (
                    <tr key={row.date}>
                      <td>{row.date}</td>
                      <td><span className="rate">{inr(row.perGram24k)}</span></td>
                      <td><span className="rate">{inr(row.perGram24k * 10)}</span></td>
                      <td>
                        {row.changePerGram === null
                          ? "—"
                          : signed(row.changePerGram)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {historyLow !== null && historyHigh !== null && (
                <p className="date-line">
                  7-day range: low <span className="rate">{inr(historyLow)} / gram</span>, high <span className="rate">{inr(historyHigh)} / gram</span>
                  {data.live ? "." : " (sample history)."}
                </p>
              )}
            </>
          ) : (
            <p className="date-line">
              7-day history is unavailable right now. The history table
              will return once the price history feed is available again.
            </p>
          )}
        </section>

        <section className="block" id="calculator" aria-label="Gold price calculator preview">
          <h2>Work Out the Price for Your Weight</h2>
          <p className="lead">
            Multiply the per-gram rate by the weight you need. The example
            below uses 22K, the purity most jewellery is made in. For any
            weight and any purity, with GST and making charges added in,
            use the full calculator.
          </p>
          <table>
            <thead>
              <tr>
                <th>Weight of 22K gold</th>
                <th>Metal cost, {data.live ? "live spot benchmark" : "sample rate"}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1 gram</td><td><span className="rate">{inr(rate22.perGram)}</span></td></tr>
              <tr><td>8 gram</td><td><span className="rate">{inr(rate22.perGram * 8)}</span></td></tr>
              <tr><td>10 gram</td><td><span className="rate">{inr(rate22.per10Gram)}</span></td></tr>
            </tbody>
          </table>
          <p className="date-line">Metal cost only, before GST and making charges.</p>
          <p><a className="cta" href="/gold-price-calculator/">Open the full calculator</a></p>
        </section>

        <section className="block" id="purity" aria-label="Purity guide">
          <h2>What the Purity Numbers Mean</h2>
          <p className="lead">
            Purity is measured out of 1000. A higher number means more pure
            gold and less of other metals in the mix.
          </p>
          <div className="city-grid">
            <article className="city-card">
              <h3>24K — 999</h3>
              <p>The purest gold. Very soft, so it is used more for coins and bars than for daily jewellery.</p>
            </article>
            <article className="city-card">
              <h3>22K — 916</h3>
              <p>The standard for jewellery in India. Strong enough to wear every day, and the number behind the 916 hallmark.</p>
            </article>
            <article className="city-card">
              <h3>18K — 750</h3>
              <p>Three quarters pure gold. Harder than 22K, often chosen for detailed or stone-set designs.</p>
            </article>
            <article className="city-card">
              <h3>14K — 585</h3>
              <p>Just over half pure gold. The hardest of the four, and usually the lowest priced per gram.</p>
            </article>
          </div>
        </section>

        <section className="block faq" id="faq" aria-label="Frequently asked questions">
          <h2>Common Questions</h2>
          {FAQS.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>

        <footer className="footer">
          <p>
            <strong>{SITE_NAME}</strong> — {TAGLINE}.
          </p>
          <p>
            Disclaimer:{" "}
            {data.live ? (
              <>
                the rates on this page are international spot prices
                converted to INR, shown before 3% GST and before making
                charges. This is a benchmark before import duty, GST,
                dealer premium and making charges — your local
                jeweller&apos;s rate will be higher.
              </>
            ) : (
              <>
                the rates on this page are a dated sample set for{" "}
                {data.dateLabel}, shown before 3% GST and before making
                charges.
              </>
            )}{" "}
            They are not investment advice. Prices vary by jeweller and by
            city, so confirm the full break-up, including GST and making
            charges, with your local jeweller before buying.
          </p>
          <p>© 2026 {SITE_NAME} · goldratetoday.live</p>
        </footer>
      </main>
    </>
  );
}
