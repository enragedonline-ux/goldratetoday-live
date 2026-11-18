"use client";

import { useEffect, useRef } from "react";

// Bauval ad units the user supplied for goldratetoday.live (2026-11-17):
//  - Banner: atOptions key 88e6bdd1bc7d0811fca7b3511176f168, 468x60 iframe
//    via https://bauval.org/22/88e6bdd1bc7d0811fca7b3511176f168
//  - Native widget: https://bauval.org/21/ebc48671e17727bc189dbe14dac598f9
//    renders into #container-ebc48671e17727bc189dbe14dac598f9
//  - Popunder: https://bauval.org/14/b6804afc41312a391c5ed90150d91353
//    (global script; opens an extra tab — see POPUNDER note in layout usage)
//
// One BannerAd + one NativeAd per page: SiteChrome renders them for every
// chrome page, and the homepage (which has its own header/main/Footer and
// does not use SiteChrome) renders the same two. Scripts are injected once
// per page load (window flags) so client-side navigation cannot double-load
// them. If a slot stays empty after 6s (blocked / no-fill) it collapses,
// so no blank "Advertisement" gap is left — same fix as the Filmyzilla
// preview page on 2026-11-17.

declare global {
  interface Window {
    atOptions?: Record<string, unknown>;
    __grtBannerLoaded?: boolean;
    __grtNativeLoaded?: boolean;
    __grtPopunderLoaded?: boolean;
    __grtAbsCloudPopunderLoaded?: boolean;
    __grtAraplhnPopunderLoaded?: boolean;
  }
}

function collapseIfEmpty(el: HTMLElement | null) {
  window.setTimeout(() => {
    if (!el) return;
    const creative = el.querySelector("iframe, ins, img, div[id^='container-'] > *");
    if (!creative) el.classList.add("is-empty");
  }, 6000);
}

function injectScript(src: string, attrs: Record<string, string> = {}) {
  const s = document.createElement("script");
  s.src = src;
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
  document.body.appendChild(s);
  return s;
}

/** 468x60 banner, centred, with a small "Advertisement" label. */
export function BannerAd() {
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slot = slotRef.current;
    collapseIfEmpty(slot);
    if (window.__grtBannerLoaded) return;
    window.__grtBannerLoaded = true;
    window.atOptions = {
      key: "88e6bdd1bc7d0811fca7b3511176f168",
      format: "iframe",
      height: 60,
      width: 468,
      params: {},
    };
    if (slot) slot.appendChild(injectScript("https://bauval.org/22/88e6bdd1bc7d0811fca7b3511176f168"));
  }, []);

  return (
    <div className="ad-slot ad-banner" ref={slotRef} aria-label="Advertisement">
      <span className="ad-label">Advertisement</span>
    </div>
  );
}

/** Native widget rendered by the /21/ script into its container div. */
export function NativeAd() {
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slot = slotRef.current;
    collapseIfEmpty(slot);
    if (window.__grtNativeLoaded) return;
    window.__grtNativeLoaded = true;
    injectScript("https://bauval.org/21/ebc48671e17727bc189dbe14dac598f9", {
      async: "async",
      "data-cfasync": "false",
    });
  }, []);

  return (
    <div className="ad-slot ad-native" ref={slotRef} aria-label="Advertisement">
      <span className="ad-label">Advertisement</span>
      <div id="container-ebc48671e17727bc189dbe14dac598f9"></div>
    </div>
  );
}

/**
 * Popunder (bauval /14/). Renders nothing; loads the global script once.
 * NOTE: this opens an extra tab/window for the visitor — the part the user
 * was warned about on the Filmyzilla page (2026-11-17) as the irritating
 * bit. It is included because the user pasted this exact script for .live
 * on 2026-11-17; removing it is one line in app/layout.tsx.
 */
export function PopunderScript() {
  useEffect(() => {
    if (window.__grtPopunderLoaded) return;
    window.__grtPopunderLoaded = true;
    injectScript("https://bauval.org/14/b6804afc41312a391c5ed90150d91353", {
      "data-cfasync": "false",
    });
  }, []);
  return null;
}

/**
 * Popunder (abscloud.org /1/). Renders nothing; loads the global script
 * once. Added 2026-11-18 at the user's request — same as the bauval
 * popunder above, it opens an extra tab/window for the visitor. Rendered
 * in the root layout (app/layout.tsx) so it loads on every page, including
 * new pages, by default. Removing it is one line in app/layout.tsx.
 */
export function AbsCloudPopunderScript() {
  useEffect(() => {
    if (window.__grtAbsCloudPopunderLoaded) return;
    window.__grtAbsCloudPopunderLoaded = true;
    injectScript("https://abscloud.org/1/a392cde5015f6a2edc12f27398234b84", {
      "data-cfasync": "false",
    });
  }, []);
  return null;
}

/**
 * Popunder (araplhn.org /4/). Renders nothing; loads the global script
 * once. Added 2026-11-18 at the user's request — the user confirmed this
 * is their ad network's link ("add ka link ha"). Same popunder behaviour
 * as the bauval/abscloud ones above: it opens an extra tab/window for the
 * visitor. Rendered in the root layout (app/layout.tsx) so it loads on
 * every page, including new pages, by default. Removing it is one line in
 * app/layout.tsx.
 */
export function AraplhnPopunderScript() {
  useEffect(() => {
    if (window.__grtAraplhnPopunderLoaded) return;
    window.__grtAraplhnPopunderLoaded = true;
    injectScript("https://araplhn.org/4/4a19618a8f1b7630a1a0a9d9d4e635f7", {
      "data-cfasync": "false",
    });
  }, []);
  return null;
}
