import Image from "next/image";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";

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
      </main>
      <Footer />
    </>
  );
}
