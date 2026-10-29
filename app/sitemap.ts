import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { CITIES, cityUrl } from "@/lib/cities";
import { POSTS } from "@/lib/posts";

const DATE = new Date();

function entry(path: string, priority: number): MetadataRoute.Sitemap[number] {
  return { url: `${SITE_URL}${path}`, lastModified: DATE, changeFrequency: "daily", priority };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    entry("/", 1),
    entry("/gold-price-calculator/", 0.8),
    entry("/gold-rate-today-cities/", 0.9),
    ...CITIES.map((c) => entry(cityUrl(c), 0.85)),
    entry("/24-carat-gold-rate-today/", 0.85),
    entry("/22-carat-gold-rate-today/", 0.9),
    entry("/18-carat-gold-rate-today/", 0.85),
    entry("/14-carat-gold-rate-today/", 0.8),
    entry("/gold-rate-history/", 0.7),
    entry("/about/", 0.5),
    entry("/privacy/", 0.5),
    entry("/contact/", 0.5),
    entry("/blog/", 0.8),
    ...POSTS.map((p) => entry(`/blog/${p.slug}/`, 0.7)),
  ];
}
