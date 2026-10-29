// Canonical host is www: that is the URL that actually serves the site today.
// Apex goldratetoday.live still fails SSL (DNS A-record fix pending); switch SITE_URL
// back to the apex only after the apex loads and is verified.
export const SITE_URL = "https://www.goldratetoday.live";
export const SITE_NAME = "GoldRateToday";
export const TAGLINE =
  "today's gold rate in India for 24K, 22K, 18K and 14K";
