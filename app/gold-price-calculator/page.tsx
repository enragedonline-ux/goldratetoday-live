import type { Metadata } from "next";
import Image from "next/image";
import { SITE_URL, SITE_NAME, TAGLINE } from "@/lib/site";
import { inr } from "@/lib/rates";
import { getLiveGold } from "@/lib/live";
import GoldCalculator from "@/components/GoldCalculator";

const DESCRIPTION =
  "Work out what your gold is worth in India. Enter the weight, pick 24K, 22K, 18K or 14K, and get the metal cost with 3% GST and making charges.";

const FAQS = [
  {
    q: "Does the calculator include GST?",
    a: "Yes. The calculator adds 3% GST on the metal cost plus the making charge, which is how GST is charged on gold jewellery in India. The rate shown at the top of the page is the metal rate only, before GST.",
  },
  {
    q: "What is a making charge?",
    a: "A making charge is what the jeweller charges for turning raw gold into a finished piece. It depends on the design and the work involved, and it is usually quoted as a percentage of the metal cost or as a fixed amount per gram. Move the slider to match the figure your jeweller quotes.",
  },
  {
    q: "Why is my jeweller's price higher than this calculator?",
    a: "The rates here are international spot prices converted to INR, shown before import duty and dealer premium. Your jeweller's rate adds those, plus GST and making charges, and it can also vary by city and by shop. Use this calculator as a benchmark, then ask your jeweller for the full break-up.",
  },
  {
    q: "How is the 22K rate worked out?",
    a: "Every purity rate is derived from the 24K base. 22K is 916 parts gold in 1000, so its per-gram rate is 916 divided by 999 of the 24K rate. 18K uses 750 and 14K uses 585, so the purities can never drift out of step.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const title = "Gold Price Calculator: 24K, 22K Rate in India";
  return {
    title,
    description: DESCRIPTION,
    alternates: { canonical: `${SITE_URL}/gold-price-calculator/` },
    openGraph: {
      title,
      description: DESCRIPTION,
      url: `${SITE_URL}/gold-price-calculator/`,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: { card: "summary", title, description: DESCRIPTION },
  };
}

export default async function CalculatorPage() {
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
        "@id": `${SITE_URL}/gold-price-calculator/`,
        url: `${SITE_URL}/gold-price-calculator/`,
        name: "Gold Price Calculator",
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
          {
            "@type": "ListItem",
            position: 2,
            name: "Gold Price Calculator",
            item: `${SITE_URL}/gold-price-calculator/`,
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
            <a href="/">Home</a>
            <a href="/#rates">Gold Rate Today</a>
            <a href="/#rates">24K</a>
            <a href="/#rates">22K</a>
            <a href="/#rates">18K</a>
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
          <h1>Gold Price Calculator</h1>
          <p>
            {SITE_NAME} shows {TAGLINE}. This calculator works out what
            your gold costs before you visit a jeweller, so you can compare
            the quote you get with a clear benchmark.
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

        <section className="block" aria-label="Gold price calculator">
          <GoldCalculator
            rates={RATES}
            live={data.live}
            updatedLabel={updatedLabel}
          />
        </section>

        <section className="block" aria-label="How the calculator works">
          <h2>How the Calculator Works</h2>
          <p className="lead">
            Four steps, in the same order a jeweller builds a bill.
          </p>
          <ul>
            <li>
              <strong>Metal cost:</strong> your weight in grams, multiplied
              by the per-gram rate for the purity you picked.
            </li>
            <li>
              <strong>Making charge:</strong> the slider percentage, applied
              to the metal cost. Move it to match the figure your jeweller
              quotes.
            </li>
            <li>
              <strong>GST:</strong> 3% on metal plus making charge, which is
              how GST is charged on gold jewellery in India.
            </li>
            <li>
              <strong>Total payable:</strong> metal plus making plus GST.
              That is the figure to compare with the jeweller&apos;s bill.
            </li>
          </ul>
          <p className="date-line">
            {data.live
              ? "Spot benchmark, before import duty and dealer premium. See the note at the top of the page."
              : `Sample figures for ${data.dateLabel}, before GST and making charges.`}
          </p>
        </section>

        <section className="block" aria-label="Purity reference">
          <h2>Rate by Purity</h2>
          <p className="lead">
            The same {data.live ? "live" : "sample"} rates the calculator
            uses, for every purity on this site.
          </p>
          <table>
            <thead>
              <tr>
                <th>Purity</th>
                <th>Fineness</th>
                <th>Per gram</th>
                <th>Per 10 gram</th>
              </tr>
            </thead>
            <tbody>
              {RATES.map((r) => (
                <tr key={r.carat}>
                  <td>{r.carat}</td>
                  <td>{r.purity}</td>
                  <td><span className="rate">{inr(r.perGram)}</span></td>
                  <td><span className="rate">{inr(r.per10Gram)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="block faq" aria-label="Frequently asked questions">
          <h2>Common Questions</h2>
          {FAQS.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>

        <section className="block" aria-label="Related pages">
          <h2>More on This Site</h2>
          <p className="lead">
            <a href="/#rates">Today&apos;s gold rates</a> for 24K, 22K, 18K
            and 14K, with morning and evening rates, or the{" "}
            <a href="/#purity">purity guide</a> on the homepage for what the
            numbers mean.
          </p>
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
