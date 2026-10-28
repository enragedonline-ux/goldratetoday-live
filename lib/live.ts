// Live gold rates for goldratetoday.live.
// Sources (free, no key — same pattern as the .online codebase):
//   - Gold spot: https://api.gold-api.com/price/XAU  (USD per troy ounce)
//   - USD -> INR: frankfurter.dev first, open.er-api.com as fallback
//   - 24h change + 7-day history: CoinGecko pax-gold (a 1:1 gold-backed
//     token proxy for spot gold, same proxy approach as .online)
// Calculation (exactly):
//   perGram24k INR = (XAU USD / 31.1034768) * USDINR, rounded to whole rupees.
//   22K = 916/999 of 24K, 18K = 750/999, 14K = 585/999; per 10g = per gram * 10.
// Honesty rule: the spot-converted figure is an INTERNATIONAL BENCHMARK
// before Indian import duty, GST, dealer premium and making charges, so it
// is materially below a local jeweller / IBJA-style retail rate. It must
// never be fudged up to match the old sample (24K Rs 14,230/g, 28 Oct 2026).
// On ANY fetch failure this module returns live: false with the old dated
// sample as fallback data, so the build and the page never break and the
// page never presents sample figures as live.

import {
  RATES as SAMPLE_RATES,
  SESSIONS as SAMPLE_SESSIONS,
  HISTORY_7_DAY as SAMPLE_HISTORY,
  SAMPLE_DATE,
  SAMPLE_DATE_ISO,
  type Purity,
  type SessionRate,
  type HistoryRow,
} from "@/lib/rates";

export type { Purity, SessionRate, HistoryRow };

export type LiveGold = {
  live: boolean;
  /** "Live" or a clear fallback label — the page renders this verbatim. */
  liveLabel: string;
  xauUsd: number | null;
  usdInr: number | null;
  fxSource: "frankfurter.dev" | "open.er-api.com" | "unavailable";
  /** ISO timestamp from the spot API, or the sample date when falling back. */
  updatedAt: string;
  /** Human date label, e.g. "28 October 2026". */
  dateLabel: string;
  rates: Purity[];
  sessions: SessionRate[];
  history7: HistoryRow[] | null;
  historyAvailable: boolean;
  changeAvailable: boolean;
  changePct24h: number | null;
};

const TROY_OUNCE_GRAMS = 31.1034768;

const PURITY_DEFS: Array<{ carat: string; purity: number; label: string }> = [
  { carat: "24K", purity: 999, label: "24 carat, fine gold" },
  { carat: "22K", purity: 916, label: "22 carat, hallmark gold" },
  { carat: "18K", purity: 750, label: "18 carat gold" },
  { carat: "14K", purity: 585, label: "14 carat gold" },
];

function derive(base24k: number, purity: number): number {
  return Math.round((base24k * purity) / 999);
}

function buildRates(
  base24k: number,
  yesterday24k: number | null
): { rates: Purity[]; changeAvailable: boolean } {
  const changeAvailable = yesterday24k !== null && yesterday24k > 0;
  const rates: Purity[] = PURITY_DEFS.map((p) => {
    const perGram = derive(base24k, p.purity);
    // When the 24h change is unavailable, yesterday is set equal to today
    // ONLY as a structural placeholder — the page must NOT render the
    // change or yesterday lines when changeAvailable is false.
    const yesterdayPerGram = changeAvailable
      ? derive(yesterday24k as number, p.purity)
      : perGram;
    const changePerGram = perGram - yesterdayPerGram;
    return {
      ...p,
      perGram,
      per10Gram: perGram * 10,
      yesterdayPerGram,
      changePerGram,
      changePct: yesterdayPerGram
        ? (changePerGram / yesterdayPerGram) * 100
        : 0,
    };
  });
  return { rates, changeAvailable };
}

function buildSessions(
  rates: Purity[],
  changeAvailable: boolean
): SessionRate[] {
  const byCarat = (carat: string) =>
    rates.find((r) => r.carat === carat) as Purity;
  const evening: SessionRate = {
    session: "Evening",
    perGram24k: byCarat("24K").perGram,
    perGram22k: byCarat("22K").perGram,
    perGram18k: byCarat("18K").perGram,
    perGram14k: byCarat("14K").perGram,
  };
  if (!changeAvailable) return [evening];
  const morning: SessionRate = {
    session: "Morning",
    perGram24k: byCarat("24K").yesterdayPerGram,
    perGram22k: byCarat("22K").yesterdayPerGram,
    perGram18k: byCarat("18K").yesterdayPerGram,
    perGram14k: byCarat("14K").yesterdayPerGram,
  };
  return [morning, evening];
}

async function fetchJson(url: string, timeoutMs = 8000): Promise<unknown> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "GoldRateToday-Live/1.0" },
      // Revalidate the live figures every 60 seconds. A failed fetch is
      // caught by the caller and falls back to the sample set, so a down
      // API can never fail the build.
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return (await res.json()) as unknown;
  } finally {
    clearTimeout(t);
  }
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return SAMPLE_DATE;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function fallback(): LiveGold {
  return {
    live: false,
    liveLabel: "Live feed unavailable — sample figures shown",
    xauUsd: null,
    usdInr: null,
    fxSource: "unavailable",
    updatedAt: `${SAMPLE_DATE_ISO}T00:00:00Z`,
    dateLabel: SAMPLE_DATE,
    rates: SAMPLE_RATES,
    sessions: SAMPLE_SESSIONS,
    history7: SAMPLE_HISTORY,
    // Sample history is shown only because the top-of-page notice already
    // says these are sample figures, not live rates.
    historyAvailable: true,
    changeAvailable: true,
    changePct24h: null,
  };
}

export async function getLiveGold(): Promise<LiveGold> {
  try {
    // Spot + FX are both required: without either, no live conversion
    // is possible and we must fall back rather than invent a figure.
    const [xauRaw, fxRaw] = await Promise.all([
      fetchJson("https://api.gold-api.com/price/XAU").catch(() => null),
      (async () => {
        const f = await fetchJson(
          "https://api.frankfurter.dev/v1/latest?from=USD&to=INR"
        ).catch(() => null);
        const frankRate = (f as { rates?: { INR?: number } } | null)?.rates
          ?.INR;
        if (typeof frankRate === "number" && frankRate > 0) {
          return { rate: frankRate, source: "frankfurter.dev" as const };
        }
        const e = await fetchJson(
          "https://open.er-api.com/v6/latest/USD"
        ).catch(() => null);
        const erRate = (e as { rates?: { INR?: number } } | null)?.rates
          ?.INR;
        if (typeof erRate === "number" && erRate > 0) {
          return { rate: erRate, source: "open.er-api.com" as const };
        }
        return null;
      })(),
    ]);

    const xauUsd = (xauRaw as { price?: number } | null)?.price;
    const updatedAt =
      (xauRaw as { updatedAt?: string } | null)?.updatedAt ??
      new Date().toISOString();
    if (typeof xauUsd !== "number" || xauUsd <= 0 || !fxRaw) {
      return fallback();
    }
    const usdInr = fxRaw.rate;

    // 24h change (CoinGecko pax-gold). Optional: failure only hides the
    // change lines, it does not kill the live rates.
    let changePct24h: number | null = null;
    try {
      const cg = (await fetchJson(
        "https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd&include_24hr_change=true"
      )) as { "pax-gold"?: { usd_24h_change?: number } } | null;
      const c = cg?.["pax-gold"]?.usd_24h_change;
      if (typeof c === "number" && Number.isFinite(c)) changePct24h = c;
    } catch {
      changePct24h = null;
    }

    const base24k = (xauUsd / TROY_OUNCE_GRAMS) * usdInr;
    const base24kRounded = Math.round(base24k);
    const yesterday24k =
      changePct24h !== null
        ? base24k / (1 + changePct24h / 100)
        : null;
    const { rates, changeAvailable } = buildRates(
      base24kRounded,
      yesterday24k
    );

    // 7-day history (CoinGecko pax-gold, one point per day, last tick of
    // each UTC day). Each USD price is converted with the CURRENT USDINR
    // rate, so history is approximate — the page says so. Failure hides
    // the block instead of inventing rows.
    let history7: HistoryRow[] | null = null;
    try {
      const hist = (await fetchJson(
        "https://api.coingecko.com/api/v3/coins/pax-gold/market_chart?vs_currency=usd&days=7"
      )) as { prices?: Array<[number, number]> } | null;
      const prices = hist?.prices ?? [];
      const byDay = new Map<string, number>();
      for (const [ts, v] of prices) {
        if (!Number.isFinite(v) || v <= 0) continue;
        byDay.set(new Date(ts).toISOString().slice(0, 10), v);
      }
      const days = [...byDay.entries()].sort((a, b) =>
        a[0] < b[0] ? -1 : 1
      );
      const last7 = days.slice(-7);
      if (last7.length >= 2) {
        const grams = last7.map(([iso, usd]) => ({
          date: new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            timeZone: "UTC",
          }),
          perGram: Math.round((usd / TROY_OUNCE_GRAMS) * usdInr),
        }));
        history7 = grams.map((row, i) => ({
          date: row.date,
          perGram24k: row.perGram,
          changePerGram:
            i === 0 ? null : row.perGram - grams[i - 1].perGram,
        }));
      }
    } catch {
      history7 = null;
    }

    return {
      live: true,
      liveLabel: "Live rates",
      xauUsd,
      usdInr,
      fxSource: fxRaw.source,
      updatedAt,
      dateLabel: formatDateLabel(updatedAt),
      rates,
      sessions: buildSessions(rates, changeAvailable),
      history7,
      historyAvailable: history7 !== null,
      changeAvailable,
      changePct24h,
    };
  } catch {
    // Any unexpected failure falls back — never throw into the page
    // or the build.
    return fallback();
  }
}
