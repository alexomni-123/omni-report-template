# Multi-client config

One directory per agency client. Each holds a `config.yaml` declaring the scrape targets, query set, and competitor list for that vertical / geography.

## Currently shipped

- `window-sg/` — HDB & Condo Window Replacement, Singapore. Worked example. Reddit (r/singapore, r/HDB, r/askSingapore) + Renotalk forum + Google Maps competitor reviews. Synthesis layer: `src/data/synthesis.ts`.

## To add a new client

```bash
# 1. Copy the template
cp -r scraper/clients/_template scraper/clients/your-client-slug

# 2. Edit config — fill in vertical, queries, competitors, output paths
$EDITOR scraper/clients/your-client-slug/config.yaml

# 3. Run scrapes (all are optional per source)
cd scraper
bun src/run-reddit.ts        clients/your-client-slug/config.yaml
bun src/run-renotalk.ts      clients/your-client-slug/config.yaml   # SG-only
bun src/run-google-maps.ts   clients/your-client-slug/config.yaml   # competitor reviews
bun src/run-google-suggest.ts                                       # uses output of above

# 4. Build the report JSON
bun src/build-report.ts clients/your-client-slug/config.yaml

# 5. Wire into the Next.js page
#    Either:
#    a) Replace src/data/scraped/window-sg.json with output (single-client mode)
#    b) Add app/[client]/page.tsx + client-specific synthesis files
#       (multi-page mode — more setup but supports parallel client URLs)
```

## What's still SG-window-specific (and how to generalize)

| File | What it hard-codes | To swap |
|---|---|---|
| `scraper/src/nlp/clusters/window-sg.ts` | 8 pain-cluster regex matchers tuned for SG window vocab | Write `clusters/<vertical>.ts` and import in `build-report.ts` |
| `src/data/synthesis.ts` | Verbatim Reddit quotes + reranked angles + copy hooks (Claude-curated for this vertical) | Hand-curate per client OR use Claude API at scrape time to regenerate |
| `src/data/sample.ts` | Fabricated baseline used as fallback | Optional — kept so the page degrades gracefully when scrape fails |

## v2 ideas (not shipped)

- `app/[client]/page.tsx` with `generateStaticParams` reading `clients/*/config.yaml` → multi-page deploy
- LLM-driven cluster discovery (Claude reads scraped corpus, generates clusters per vertical)
- White-label theming (agency client gets their brand colors via config)
- PDF batch export (cron job that generates the PDF per client per week)
