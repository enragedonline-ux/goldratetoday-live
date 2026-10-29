import Image from "next/image";
import type { ReactNode } from "react";
import { SITE_NAME, TAGLINE } from "@/lib/site";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/gold-rate-today-cities/", label: "Cities" },
  { href: "/24-carat-gold-rate-today/", label: "24K" },
  { href: "/22-carat-gold-rate-today/", label: "22K" },
  { href: "/18-carat-gold-rate-today/", label: "18K" },
  { href: "/gold-price-calculator/", label: "Calculator" },
  { href: "/blog/", label: "Blog" },
  { href: "/about/", label: "About" },
  { href: "/privacy/", label: "Privacy" },
];

export default function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="header">
        <div className="header-inner">
          <a className="brand" href="/" aria-label="GoldRateToday home">
            <Image src="/logo.svg" alt="GoldRateToday logo" width={160} height={48} priority />
          </a>
          <nav className="nav" aria-label="Main navigation">
            {NAV.map((n) => (
              <a key={n.href} href={n.href}>{n.label}</a>
            ))}
          </nav>
        </div>
      </header>
      <main className="wrap" id="top">
        {children}
        <footer className="footer">
          <p>
            <strong>{SITE_NAME}</strong> — {TAGLINE}.
          </p>
          <p>
            Disclaimer: the rates on this page are a national benchmark
            worked out from the international gold spot price converted
            to INR, shown before import duty, GST, dealer premium and
            making charges. They are not an official local rate for any
            city, and your local jeweller&apos;s rate will be higher.
            Not investment advice.
          </p>
          <p>
            <a href="/">Home</a> · <a href="/gold-rate-today-cities/">Cities</a> ·{" "}
            <a href="/gold-rate-history/">Rate History</a> ·{" "}
            <a href="/blog/">Blog</a> · <a href="/about/">About</a> ·{" "}
            <a href="/contact/">Contact</a> · <a href="/privacy/">Privacy</a>
          </p>
          <p>
            Sister site:{" "}
            <a href="https://goldratetoday.online/">goldratetoday.online</a>
          </p>
          <p>© 2026 {SITE_NAME} · goldratetoday.live</p>
        </footer>
      </main>
    </>
  );
}
