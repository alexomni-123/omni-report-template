# OMNI Report Template

> Client-URL → marketing-angle report. Built for digital marketing agencies who need to produce repeatable, multi-viz, **evidence-backed** "what-should-we-test" reports for new clients in any vertical.

**Live demo:** **https://alexomni-123.github.io/omni-report-template/**

## What's in the report

A 9-section deliverable, **every claim traceable to its source**:

1. **Snapshot** — vertical, service area, business model, price band. *(SG-window worked example uses real HDB.gov.sg market data: 1.13M HDB flats, 13,480 hitting MOP in 2026.)*
2. **Inferred ICP** — life-stage / home-type / urgency / geographic markers extracted from corpus comments. Honest about Reddit-skew bias.
3. **Pain Points** — 8 clusters scored on real customer language. Each cluster shows verbatim Reddit/forum quotes attributed to source threads. Sentiment-graded **🔥 Hot vs 🔵 Chronic** so you target hot-pain ads first.
4. **Keyword Phrases** — extracted phrases stage-classified (problem / solution / brand) + a "Google Search completions" block from suggestqueries.google.com (real SG search demand, no API key).
5. **Competitor Angle Teardown** — real SG businesses (hero hook / offer / proof extracted via WebFetch from their live homepages) + a **Gap Analysis** card showing what they all say vs what customers actually say.
6. **Marketing Angles** — re-ranked by Claude reading the corpus directly (sentiment + competitor-gap-corrected, not just citation count).
7. **Copy Hooks** — each anchored on a verbatim customer quote. No invented language.
8. **Test Plan** — 3 launch creatives with format / budget / audience / "why first" rationale.
9. **What to Do Tomorrow** — 6 team-assignable actions for a 15-person agency (Performance Analyst → Senior Copywriter → Video Editor → Media Buyer → Graphic Designer → Account Manager).

Plus an **Executive Summary** card pinned at top (screenshot-ready for Slack / email) and a **Data Quality Table** at the bottom grading every section as Real / LLM-Synthesis / Illustrative.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS 4** (CSS-first config)
- **Recharts** for multi-viz charts (pie, horizontal bar, scatter, radar)
- **lucide-react** icons
- **Bun** package manager / runtime
- **GitHub Pages** auto-deploy via Actions on every push

## Run locally

```bash
bun install
bun run dev          # → http://localhost:3000
```

## The pipeline (3 layers)

```
clients/<slug>/config.yaml       (declarative: queries, subreddits, competitors)
        ↓
scraper/   (Reddit .json + Renotalk + Google Maps + Google Suggest + Playwright stealth)
        ↓
src/data/scraped/<slug>.json     (NLP-extracted phrases + sentiment + clusters)
        ↓
src/data/synthesis.ts            (Claude reading corpus, curating verbatim evidence)
        ↓
Next.js page → live URL or PDF deliverable
```

### Generate real customer data

```bash
cd scraper
bun install
bunx playwright install chromium     # one-time, ~150 MB

# SG windows worked example (full pipeline):
bun src/run-reddit.ts          clients/window-sg/config.yaml      # ~12 min
bun src/run-renotalk.ts                                            # ~3 min
bun src/run-google-maps.ts                                         # ~2 min, success rate ~70%
bun src/run-google-suggest.ts                                      # ~30s
bun src/build-report.ts        clients/window-sg/config.yaml       # NLP + clustering
bun src/run-infer-icp.ts                                           # demographic markers
```

Output writes to `src/data/scraped/window-sg.json`. The page banner flips from amber "Sample data" to green "Real data + LLM synthesis" automatically.

### Add a new client / vertical

```bash
# 1. Copy the template
cp -r scraper/clients/_template scraper/clients/your-client-slug
$EDITOR scraper/clients/your-client-slug/config.yaml

# 2. (Optional) Add vertical-specific pain clusters
$EDITOR scraper/src/nlp/clusters/your-vertical.ts
# Register it in scraper/src/build-report.ts — CLUSTERS_BY_VERTICAL map

# 3. Run the pipeline
cd scraper && bun src/run-reddit.ts clients/your-client-slug/config.yaml
bun src/build-report.ts clients/your-client-slug/config.yaml

# 4. Wire the JSON into the Next.js side (replace single-client mode or fan out)
```

**Worked examples shipping today:**
- `clients/window-sg/` — HDB & Condo Window Replacement (full corpus, full synthesis, on the live URL)
- `clients/skincare-sg/` — DTC skincare for sensitive/acne-prone skin in tropical SG/SEA (config-only validation that the pipeline generalizes)

## Customize

- **Report data**: edit `src/data/sample.ts` (fallback) or replace `src/data/scraped/<slug>.json` (real data).
- **Synthesis layer** (verbatim quotes, hooks, angles): edit `src/data/synthesis.ts` after reading your corpus.
- **Brand accent**: `data-brand="<slug>"` on `<main>` + matching CSS rule in `globals.css`.
- **Sections**: each in `src/components/sections/`; composition in `src/app/page.tsx`.

## Print → PDF deliverable

Click 🖨️ "Print / PDF" on the live page → browser native PDF dialog. Output:
- Cover page (vertical / client / agency / Rule-6 transparency footer)
- A4 layout, 0.5in margins, page-break-respecting sections
- Footnoted URLs after every link
- Recharts SVGs constrained to page width

No server-side PDF pipeline needed.

## Deploy

GitHub Pages via Actions (already wired):

```bash
gh api -X POST repos/<your-user>/<your-fork>/pages -f build_type=workflow
```

Vercel (also works as vanilla Next.js):

```bash
vercel deploy --prod
```

When deploying to Vercel or a custom domain, unset `GITHUB_PAGES=1` so the basePath isn't applied.

## Honest gaps

Documented inside the live page's **Data Quality Table**, but in summary:
- **Corpus skew** — Reddit + Renotalk over-represent younger / tech-savvy audiences. Older HDB owner-occupiers (the actual SG-window decision-maker) are on Facebook Groups + leave Google reviews. Both are scraping-resistant; documented in the page banner.
- **HardwareZone EDMW** — 403s even with Playwright + stealth (Cloudflare WAF). Code shipped; needs an authenticated session cookie to unblock.
- **Meta Ad Library** — JS-walled, blocks WebFetch. Needs proper Playwright session work to verify "what hooks competitors are running right now" — listed as v2.
- **Real keyword volumes** — Google Suggest ships completions but not absolute search volumes. Hooking Ahrefs/Semrush API would cost ~$50/mo and deliver real volumes.

## Generated with

[OMNI BRAIN Oracle](https://github.com/alexomni-123/OMNI-AI) — head-coach Oracle for a 15-person digital marketing agency. AI-generated content carries `[Generated with OMNI BRAIN]` per Oracle Rule 6 (never pretend to be human).

## License

MIT — fork it, white-label it, ship it.
