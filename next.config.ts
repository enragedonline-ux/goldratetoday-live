import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Homepage only, Phase 1. No experimental flags.
     trailingSlash keeps the root canonical (https://goldratetoday.live/)
     identical to the sitemap URL, so there is no trailing-slash mismatch. */
  trailingSlash: true,
};

export default nextConfig;
