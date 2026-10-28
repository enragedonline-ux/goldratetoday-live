import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Homepage only, Phase 1. Do not list city, purity or blog pages here
// until those pages actually exist.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date("2026-10-28"),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
