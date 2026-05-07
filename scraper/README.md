# Scraper — Real Customer Language Pipeline

Browser-automation + JSON-endpoint scrapers that feed the OMNI report template with **actual customer phrases** instead of fabricated sample data.

> Free stack — no paid APIs. Reddit's `.json` endpoint, public forum HTML, headless Chromium with stealth plugin for Google Maps + Carousell.

## What it does

1. **Reddit** — hits the `.json` endpoint of any Reddit URL (no auth, no rate limit beyond polite throttling). Crawls configured subs + queries, walks comment trees, dumps everything.
2. **HardwareZone EDMW + Renotalk** — Singapore's biggest renovation forums. HTML scrape with `cheerio`, polite throttle.
3. **Google Maps reviews** — Playwright + `puppeteer-extra-plugin-stealth` over the public Maps URL. No API key. Best-effort against Google's anti-bot defences.
4. **Carousell SG** — listings + Q&A blocks for category-relevant terms. Playwright + stealth.
5. **NLP pipeline** — `compromise` noun-phrase extraction + n-grams → ranked phrase list with **citation URLs** (so every claim is verifiable).
6. **Pain clustering** — regex-based clustering into pre-defined pain categories (currently `clusters/window-sg.ts` — hand-tuned for the SG window-replacement vertical). Intensity score = log-scaled total citations.
7. **Report builder** — emits a `Report`-shaped JSON the Next.js page consumes at build time.

## Setup

```bash
cd scraper
bun install
bun run install-browsers   # downloads Chromium for Playwright (~150 MB, one-time)
```

## Run

Edit `config.yaml` to match the target client + competitors, then:

```bash
# scrape everything
bun run scrape:all

# or scrape one source at a time
bun run scrape:reddit
SOURCES=forums bun src/run-all.ts

# turn raw scrapes into the Report JSON
bun run build-report
```

Output lands at `../src/data/scraped/window-sg.json`. Next time the Next.js site builds, the page will read the real data instead of the fabricated sample.

## Configuration

`config.yaml` — declarative. Subreddits, queries, forum bases, business names, NLP thresholds, output paths. Edit-and-rerun = swap clients.

## Honest limitations

- **Google Maps** — Google blocks aggressively. Expect the Playwright scrape to succeed ~70% of runs. On block, you'll get partial reviews or zero. The script logs and moves on instead of failing the whole pipeline.
- **HardwareZone search** — XenForo's search requires a session token. v1 falls back to scanning the forum index for thread titles matching queries. Misses deep-history threads. Workaround: add specific thread URLs to config.
- **Reddit search** — Reddit's relevance ranking is weak; we throttle queries and walk the top N posts per query. Not exhaustive — but good for the most-discussed customer pain points.
- **No volume data** — we get phrase *frequencies in scraped corpora*, not Google search volumes. For real volumes you'd plug Ahrefs / Semrush / keywordtool.io. v2.
- **Pain clustering is regex-driven** — works well for windows because the pain vocabulary is small + well-known. For broader verticals, swap to an LLM-based clustering pass.

## ToS

Scraping publicly-visible data for marketing research is generally treated as lawful under established precedent, but every site's Terms govern automation against their service. Throttle politely (this scraper does), don't redistribute raw text, and use the output for analysis. If a site rate-limits you, back off — don't fight it.
