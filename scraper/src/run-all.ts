/**
 * Orchestrator: reads config, runs every enabled source in sequence,
 * dumps each source's RawComment[] to output/raw/<source>.json.
 *
 * Then call `bun run build-report` to turn the raw dump into a Report JSON.
 * Kept separate so re-runs don't have to re-scrape.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { scrapeReddit, type RedditConfig } from "./sources/reddit";
import { scrapeForums, type ForumsConfig } from "./sources/forums";
import { scrapeGoogleMaps, type GoogleMapsConfig } from "./sources/google-maps";
import { scrapeCarousell, type CarousellConfig } from "./sources/carousell";
import type { RawComment } from "./types";

type Config = {
  reddit: RedditConfig;
  forums: ForumsConfig;
  googleMaps: GoogleMapsConfig;
  carousell: CarousellConfig;
  output: { rawPath: string };
};

async function dump(rawDir: string, name: string, comments: RawComment[]) {
  await writeFile(join(rawDir, `${name}.json`), JSON.stringify(comments, null, 2));
  console.log(`  → wrote ${comments.length} → ${name}.json`);
}

async function main() {
  const cfgPath = process.argv[2] ?? "config.yaml";
  const cfg = parseYaml(await readFile(cfgPath, "utf8")) as Config;
  await mkdir(cfg.output.rawPath, { recursive: true });

  const wantedRaw = (process.env.SOURCES ?? "reddit,forums,google,carousell").split(",");
  const wanted = new Set(wantedRaw.map((s) => s.trim()));

  if (wanted.has("reddit")) {
    console.log("\n== reddit ==");
    try {
      await dump(cfg.output.rawPath, "reddit", await scrapeReddit(cfg.reddit));
    } catch (e) {
      console.error(`reddit failed: ${(e as Error).message}`);
    }
  }

  if (wanted.has("forums")) {
    console.log("\n== forums ==");
    try {
      await dump(cfg.output.rawPath, "forums", await scrapeForums(cfg.forums));
    } catch (e) {
      console.error(`forums failed: ${(e as Error).message}`);
    }
  }

  if (wanted.has("google")) {
    console.log("\n== google maps ==");
    try {
      await dump(cfg.output.rawPath, "google-maps", await scrapeGoogleMaps(cfg.googleMaps));
    } catch (e) {
      console.error(`google-maps failed: ${(e as Error).message}`);
    }
  }

  if (wanted.has("carousell")) {
    console.log("\n== carousell ==");
    try {
      await dump(cfg.output.rawPath, "carousell", await scrapeCarousell(cfg.carousell));
    } catch (e) {
      console.error(`carousell failed: ${(e as Error).message}`);
    }
  }

  console.log("\n✓ all scrapes done. Now run: bun run build-report");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
