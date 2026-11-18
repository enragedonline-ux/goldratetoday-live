"use client";

import { useEffect, useState } from "react";

/**
 * Small visit popup banner (added 2026-11-18 at the user's request).
 * Opens on visit (1.5s after load), closes when the user clicks the X
 * (or the backdrop). Shows once per session (sessionStorage) so it does
 * not reappear on every page navigation. The button is a real working
 * link to the gold price calculator. Rendered in the root layout
 * (app/layout.tsx) so it appears on every page, including new pages.
 */
export function PopupBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem("grt-popup-dismissed")) return;
    } catch {
      // sessionStorage unavailable — still show the popup once.
    }
    const t = window.setTimeout(() => setVisible(true), 1500);
    return () => window.clearTimeout(t);
  }, []);

  function close() {
    setVisible(false);
    try {
      window.sessionStorage.setItem("grt-popup-dismissed", "1");
    } catch {
      // Ignore storage errors; the popup is already hidden.
    }
  }

  if (!visible) return null;

  return (
    <div
      className="popup-overlay"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Gold price popup"
    >
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={close} aria-label="Close">
          &times;
        </button>
        <h3>Gold at a 14-month low</h3>
        <p>
          Spot gold is below $3,800 for the first time since September 2025.
          Check today&rsquo;s rate and work out what your gold is worth.
        </p>
        <a className="cta" href="/gold-price-calculator/">
          Calculate your gold price
        </a>
      </div>
    </div>
  );
}
