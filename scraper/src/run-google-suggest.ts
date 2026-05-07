/**
 * Google Suggest — free, no API key. Validates that scraped phrases
 * actually appear in real Singaporean search behavior, AND surfaces the
 * actual completions Google offers (which are weighted by real query
 * volume — adjacent gold for keyword expansion).
 *
 * Endpoint: https://suggestqueries.google.com/complete/search
 *   client=firefox returns clean JSON [query, [suggestions]]
 *   gl=sg = country Singapore
 *   hl=en = language English
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function getSuggestions(q: string): Promise<string[]> {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(
    q
  )}&hl=en&gl=sg`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 Safari/605.1.15",
      },
    });
    if (!res.ok) {
      console.warn(`  ! ${res.status} for "${q}"`);
      return [];
    }
    const data = (await res.json()) as [string, string[]];
    return Array.isArray(data?.[1]) ? data[1] : [];
  } catch (e) {
    console.warn(`  ! "${q}": ${(e as Error).message}`);
    return [];
  }
}

async function main() {
  const reportPath = "../src/data/scraped/window-sg.json";
  const report = JSON.parse(await readFile(reportPath, "utf8"));
  const seeds: string[] = report.keywords?.map((k: { phrase: string }) => k.phrase) ?? [];
  if (seeds.length === 0) {
    console.error("no keywords in report — run build-report first");
    process.exit(1);
  }

  // Take the top 15 + add a few SG-window seed expansions
  const top = seeds.slice(0, 15);
  const expansions = ["soundproof window hdb", "casement window seepage", "low e glass singapore"];
  const queries = [...new Set([...top, ...expansions])];

  console.log(`google-suggest: ${queries.length} seed queries`);
  const out: { seed: string; suggestions: string[] }[] = [];
  for (const q of queries) {
    const suggestions = await getSuggestions(q);
    out.push({ seed: q, suggestions });
    console.log(`  ✓ "${q}" → ${suggestions.length} suggestions`);
    await sleep(400 + Math.random() * 400);
  }

  await mkdir("./output", { recursive: true });
  await writeFile(join("./output", "google-suggest.json"), JSON.stringify(out, null, 2));

  // Also flatten unique suggestions for easy inspection
  const flat = [...new Set(out.flatMap((o) => o.suggestions))];
  console.log(`✓ ${flat.length} unique SG-Google completions discovered`);
  console.log(flat.slice(0, 12).join("\n  "));
}

main();
