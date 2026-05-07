# OMNI Report Template

> Client-URL → marketing-angle report template. Built for digital marketing agencies who need to produce repeatable, multi-viz "what-should-we-test" reports for new clients in any vertical.

**Live demo:** **https://alexomni-123.github.io/omni-report-template/**

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

## Generate real data (optional)

Replace the fabricated sample with real customer phrases scraped from Reddit, HardwareZone, Renotalk, Google Maps, and Carousell:

```bash
cd scraper
bun install
bunx playwright install chromium     # one-time, ~150 MB
bun run scrape:all                    # full scrape, ~30–60 min
# or for a quick demo:
bun src/run-reddit.ts demo-sg-config.yaml   # ~12 min
bun run build-report
```

Output writes to `src/data/scraped/window-sg.json` — the page banner flips from amber "Sample data" to green "Real data" automatically. See `scraper/README.md` for the full pipeline.

## Customize

- **Replace the report data**: edit `src/data/sample.ts`. The `Report` type is defined in `src/lib/types.ts`.
- **Re-skin**: edit `src/app/globals.css` — accent color is the `--accent` CSS variable (`#ea580c` by default).
- **Add/remove sections**: each lives in `src/components/sections/`. The page composition is in `src/app/page.tsx`.

## Deploy

The repo is pre-wired for **GitHub Pages** via Actions — every push to `main` rebuilds and redeploys automatically. The workflow is at `.github/workflows/deploy.yml`. To enable on a fork:

```bash
gh api -X POST repos/<your-user>/<your-fork>/pages -f build_type=workflow
```

Or, for **Vercel**, this is also a vanilla Next.js app:

```bash
vercel deploy --prod
```

Note: when deploying to Vercel (or any custom domain), unset `GITHUB_PAGES=1` so the basePath isn't applied — Vercel serves at the domain root.

## Generated with

[OMNI BRAIN Oracle](https://github.com/alexomni-123/OMNI-AI) — head-coach Oracle for a digital marketing agency. AI-generated content in this template is marked with `[Generated with OMNI BRAIN]` per Oracle Rule 6 (never pretend to be human).

## License

MIT — fork it, white-label it, ship it.
