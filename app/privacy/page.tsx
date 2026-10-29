import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import SiteChrome from "@/components/SiteChrome";

const TITLE = "Privacy Policy — GoldRateToday";
const DESCRIPTION = "Privacy policy for GoldRateToday: what we collect, how cookies and advertising work, and how to contact us about privacy.";
const URL = `${SITE_URL}/privacy/`;

export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_NAME, type: "website" },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

export default function PrivacyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": URL, url: URL, name: TITLE, description: DESCRIPTION, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/` } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Privacy", item: URL },
      ] },
    ],
  };
  return (
    <SiteChrome>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="hero">
        <h1>Privacy Policy</h1>
        <div className="gold-bar" aria-hidden="true" />
        <p>This page explains what GoldRateToday collects when you visit, how cookies and advertising work on this site, and how to get in touch about privacy. Last updated: 29 October 2026.</p>
      </div>
      <section className="block" aria-label="Information we collect">
        <h2>Information We Collect</h2>
        <p>This site does not ask you to create an account, and it does not collect your name, address or payment details. The calculator runs in your browser and the figures you enter are not sent to us or stored by us. Like most websites, this site&apos;s hosting provider may record basic technical information, such as the pages you visit, your approximate location from your IP address, and your browser type, in server logs used to keep the site running and to understand overall traffic.</p>
        <p>If you email us, we receive whatever you choose to include in that email, and we use it only to reply to you. We do not sell personal information to anyone.</p>
      </section>
      <section className="block" aria-label="Cookies and advertising">
        <h2>Cookies and Advertising</h2>
        <p>This site is supported by advertising. Advertising partners may use cookies and similar technologies to show ads, to measure how ads perform, and, where you have consented, to show ads that are more relevant to your interests. Those partners collect information such as your device type, the pages you visit on this site, and whether you clicked an ad, under their own privacy policies.</p>
        <p>You can control cookies in your browser settings, including blocking third-party cookies or deleting cookies already stored. Blocking cookies may change how ads appear, but it will not stop you reading the rates and guides on this site. Where your region requires consent for advertising cookies, a consent choice is shown before those cookies are set, and you can change your choice at any time in your browser.</p>
        <p>Links on this site go to other websites, including our sister site and public information sources. Those sites have their own privacy policies, and this policy does not cover them.</p>
      </section>
      <section className="block" aria-label="Children and changes">
        <h2>Children, Changes and Contact</h2>
        <p>This site is a general information site and is not aimed at children. We do not knowingly collect personal information from children. If this policy changes, the updated version will be posted on this page with a new last-updated date. For any privacy question, contact us by email at <a href="mailto:enraged.online@gmail.com">enraged.online@gmail.com</a>.</p>
        <p className="lead"><a href="/">Home</a> · <a href="/about/">About</a> · <a href="/contact/">Contact</a></p>
      </section>
    </SiteChrome>
  );
}
