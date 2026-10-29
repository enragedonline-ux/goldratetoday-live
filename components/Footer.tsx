import Image from "next/image";
import { CITIES, cityUrl } from "@/lib/cities";
import { SITE_NAME, TAGLINE } from "@/lib/site";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/gold-rate-today-cities/", label: "Gold Rate in All Cities" },
  { href: "/gold-rate-history/", label: "Gold Rate History" },
  { href: "/gold-price-calculator/", label: "Gold Price Calculator" },
  { href: "/blog/", label: "Blog" },
];

const PURITY_LINKS = [
  { href: "/24-carat-gold-rate-today/", label: "24K Gold Rate Today" },
  { href: "/22-carat-gold-rate-today/", label: "22K Gold Rate Today" },
  { href: "/18-carat-gold-rate-today/", label: "18K Gold Rate Today" },
  { href: "/14-carat-gold-rate-today/", label: "14K Gold Rate Today" },
];

const COMPANY_LINKS = [
  { href: "/about/", label: "About Us" },
  { href: "/contact/", label: "Contact" },
  { href: "/privacy/", label: "Privacy Policy" },
  { href: "/blog/", label: "Blog" },
];

export default function Footer() {
  const topCities = CITIES.filter((c) => c.tier === 1);
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="footer-col footer-brand">
          <a href="/" aria-label="GoldRateToday home">
            <Image src="/logo.svg" alt="GoldRateToday logo" width={160} height={48} />
          </a>
          <p>
            <strong>{SITE_NAME}</strong> — {TAGLINE}.
          </p>
          <p>
            Rates are a national spot-converted benchmark, before import
            duty, GST, dealer premium and making charges. Not investment
            advice.
          </p>
        </div>
        <nav className="footer-col" aria-label="Quick links">
          <h3>Quick Links</h3>
          <ul>
            {QUICK_LINKS.map((l) => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </nav>
        <nav className="footer-col" aria-label="Top cities">
          <h3>Top Cities</h3>
          <ul>
            {topCities.map((c) => (
              <li key={c.slug}><a href={cityUrl(c)}>Gold Rate in {c.city}</a></li>
            ))}
            <li><a href="/gold-rate-today-cities/">All Cities</a></li>
          </ul>
        </nav>
        <nav className="footer-col" aria-label="Gold by purity">
          <h3>Gold by Purity</h3>
          <ul>
            {PURITY_LINKS.map((l) => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </nav>
        <nav className="footer-col" aria-label="Company">
          <h3>Company</h3>
          <ul>
            {COMPANY_LINKS.map((l) => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
            <li><a href="https://goldratetoday.online/">Sister Site: goldratetoday.online</a></li>
          </ul>
        </nav>
      </div>
      <div className="wrap footer-bottom">
        <p>© 2026 {SITE_NAME} · goldratetoday.live · Rates vary by jeweller and by city — confirm the full break-up, including GST and making charges, before buying.</p>
      </div>
    </footer>
  );
}
