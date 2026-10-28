# GoldRateToday — goldratetoday.live (Phase 1: homepage only)

India-focused, gold-only price site. Brand: GoldRateToday.
Tagline: today's gold rate in India for 24K, 22K, 18K and 14K.

## Scope of this build
- Homepage ONLY. No city pages, no purity pages, no blog yet.
- No links to pages that do not exist. City cards and nav items point to
  homepage sections, not to unbuilt pages.
- NOT pushed to GitHub and NOT deployed to Vercel in this phase.
  Repo creation by the user is the gate for deploy.

## Rates honesty
- `lib/rates.ts` holds a SAMPLE set dated 28 October 2026. It is not a
  live feed. The homepage shows a visible sample-data notice.
- Before launch: wire a real daily rate source, replace the sample figures,
  and only then remove the notice.

## Zero-copy rule
- The reference site was used for structure/workflow only (daily
  morning/evening flow, purity breakdown, history flow).
- No copied text, headings, disclaimer wording, design, logos, customer
  lists or branding, and no claim of affiliation with any other site.
  All visible copy on this homepage is original.

## Run
- `npm install`
- `npm run build`
