// Rates data for the goldratetoday.live homepage (Phase 1 only).
//
// HONESTY NOTE — READ BEFORE LAUNCH:
// This is a clearly dated SAMPLE set, dated 28 October 2026. It is NOT a
// live feed and the page must not be presented as one. The homepage carries
// a visible sample-data notice for exactly this reason.
// TODO (next step before launch): wire a real daily rate source, replace
// SAMPLE_DATE / the base figures below with the fetched values, and only
// then remove the sample-data notice. Do not launch with this file as if
// it were live data.
//
// Purity maths: every purity rate is derived from the 24K base, so the
// table can never drift out of step:
//   24K = 999 / 999 of the base
//   22K = 916 / 999 of the base
//   18K = 750 / 999 of the base
//   14K = 585 / 999 of the base
// All figures are in INR, before GST and making charges.

export const SAMPLE_DATE = "28 October 2026";
export const SAMPLE_DATE_ISO = "2026-10-28";

const BASE_24K_PER_GRAM = 14230;
const YESTERDAY_24K_PER_GRAM = 14108;
const MORNING_24K_PER_GRAM = 14182;

export type Purity = {
  carat: string;
  purity: number;
  label: string;
  perGram: number;
  per10Gram: number;
  yesterdayPerGram: number;
  changePerGram: number;
  changePct: number;
};

function derive(base24k: number, purity: number): number {
  return Math.round((base24k * purity) / 999);
}

const PURITIES: Array<{ carat: string; purity: number; label: string }> = [
  { carat: "24K", purity: 999, label: "24 carat, fine gold" },
  { carat: "22K", purity: 916, label: "22 carat, hallmark gold" },
  { carat: "18K", purity: 750, label: "18 carat gold" },
  { carat: "14K", purity: 585, label: "14 carat gold" },
];

export const RATES: Purity[] = PURITIES.map((p) => {
  const perGram = derive(BASE_24K_PER_GRAM, p.purity);
  const yesterdayPerGram = derive(YESTERDAY_24K_PER_GRAM, p.purity);
  const changePerGram = perGram - yesterdayPerGram;
  return {
    ...p,
    perGram,
    per10Gram: perGram * 10,
    yesterdayPerGram,
    changePerGram,
    changePct: (changePerGram / yesterdayPerGram) * 100,
  };
});

export type SessionRate = {
  session: string;
  perGram24k: number;
  perGram22k: number;
  perGram18k: number;
  perGram14k: number;
};

// Morning session is the opening figure for the day; evening is the closing
// figure and matches the hero cards above. Same purity maths throughout.
export const SESSIONS: SessionRate[] = [
  {
    session: "Morning",
    perGram24k: derive(MORNING_24K_PER_GRAM, 999),
    perGram22k: derive(MORNING_24K_PER_GRAM, 916),
    perGram18k: derive(MORNING_24K_PER_GRAM, 750),
    perGram14k: derive(MORNING_24K_PER_GRAM, 585),
  },
  {
    session: "Evening",
    perGram24k: derive(BASE_24K_PER_GRAM, 999),
    perGram22k: derive(BASE_24K_PER_GRAM, 916),
    perGram18k: derive(BASE_24K_PER_GRAM, 750),
    perGram14k: derive(BASE_24K_PER_GRAM, 585),
  },
];

export type HistoryRow = {
  date: string;
  perGram24k: number;
  changePerGram: number | null;
};

// Sample 7-day series for the 24K rate, ending on the sample date. The
// change column is computed against the previous row, not typed by hand.
const HISTORY_GRAMS: Array<{ date: string; perGram: number }> = [
  { date: "22 Oct 2026", perGram: 14082 },
  { date: "23 Oct 2026", perGram: 14155 },
  { date: "24 Oct 2026", perGram: 14110 },
  { date: "25 Oct 2026", perGram: 14190 },
  { date: "26 Oct 2026", perGram: 14148 },
  { date: "27 Oct 2026", perGram: YESTERDAY_24K_PER_GRAM },
  { date: "28 Oct 2026", perGram: BASE_24K_PER_GRAM },
];

export const HISTORY_7_DAY: HistoryRow[] = HISTORY_GRAMS.map((row, i) => ({
  date: row.date,
  perGram24k: row.perGram,
  changePerGram:
    i === 0 ? null : row.perGram - HISTORY_GRAMS[i - 1].perGram,
}));

// 30-day summary only, for the mini-history block. A full 30-row table is a
// later phase, once a real daily feed exists; inventing 30 rows now would
// be fake history, so this block reports only the range of this sample set.
export const HISTORY_30_DAY = {
  note: "30-day view, sample set",
  highPerGram: 14230,
  lowPerGram: 14082,
  startPerGram: 14082,
  endPerGram: BASE_24K_PER_GRAM,
};

export type Tier1City = {
  city: string;
  state: string;
};

// Tier 1 cities, in keyword priority order (see the keyword map). These are
// display cards on the homepage for now. They are NOT links: the city
// pages do not exist yet, and this homepage must contain zero broken links.
// City cards use the same national sample base as the hero cards until
// city feeds are wired in a later phase.
export const TIER_1_CITIES: Tier1City[] = [
  { city: "Bangalore", state: "Karnataka" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Delhi", state: "Delhi" },
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Pune", state: "Maharashtra" },
];

export function inr(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

export function signed(n: number): string {
  return (n >= 0 ? "+" : "") + inr(n);
}

export function signedPct(n: number): string {
  return (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
}
