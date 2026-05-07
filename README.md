# OMNI Report Template

> Client-URL → marketing-angle report template. Built for digital marketing agencies who need to produce repeatable, multi-viz "what-should-we-test" reports for new clients in any vertical.

**Live demo:** *(link added after first deploy)*

## What it does

Given a client's website, service area, and a few competitors, this template renders an 8-section marketing-angle report:

1. **Snapshot** — vertical, geo, business model, price band
2. **Inferred ICP** — age, home/customer type, awareness stage
3. **Pain Points** — sourced from client copy, reviews, Reddit/Quora, forums; ranked by intensity
4. **Keyword Phrases** — bucketed by buyer-awareness stage (problem → solution → brand)
5. **Competitor Angle Teardown** — top 3 SERP rivals: hero hook + offer + proof
6. **Marketing Angles** — ranked by pain × volume × differentiation, with bubble + radar viz
7. **Copy Hooks** — 1 headline + 1 opening line per angle, matched to stage
8. **Test Plan** — first 3 ad creatives recommended to launch

The current `src/data/sample.ts` is a worked example for the **HDB & Condo Window Replacement** vertical in Singapore — pain points are climate-/housing-specific (monsoon seepage, MRT noise, aircon-bill heat gain, HDB permit anxiety), and angles are tuned for Meta + TikTok geo-targeted by HDB town. Drop in your own report data with the same shape and the page re-renders.

## Stack

- **Next.js 16** (App Router) + React 19
- **TypeScript**
- **Tailwind CSS 4** (CSS-first config)
- **Recharts** for multi-viz charts (pie, horizontal bar, scatter, radar)
- **lucide-react** for icons
- **Bun** as package manager / runtime

## Run locally

```bash
bun install
bun run dev
```

Then visit `http://localhost:3000`.

## Customize

- **Replace the report data**: edit `src/data/sample.ts`. The `Report` type is defined in `src/lib/types.ts`.
- **Re-skin**: edit `src/app/globals.css` — accent color is the `--accent` CSS variable (`#ea580c` by default).
- **Add/remove sections**: each lives in `src/components/sections/`. The page composition is in `src/app/page.tsx`.

## Deploy

This is a vanilla Next.js app — deploys to Vercel with zero configuration:

```bash
vercel deploy --prod
```

Or import the repo at [vercel.com/new](https://vercel.com/new).

## Generated with

[OMNI BRAIN Oracle](https://github.com/alexomni-123/OMNI-AI) — head-coach Oracle for a digital marketing agency. AI-generated content in this template is marked with `[Generated with OMNI BRAIN]` per Oracle Rule 6 (never pretend to be human).

## License

MIT — fork it, white-label it, ship it.
