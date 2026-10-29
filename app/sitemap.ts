import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Only list pages that actually exist. Do not list city, purity or blog
// pages here until those pages exist.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date("2026-10-28"),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/gold-price-calculator/`,
      lastModified: new Date("2026-10-29"),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
