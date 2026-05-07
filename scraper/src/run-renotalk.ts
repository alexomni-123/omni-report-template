import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { scrapeRenotalkForum } from "./sources/renotalk";

const RAW = "./output/raw/";
await mkdir(RAW, { recursive: true });

const queries = [
  "window contractor",
  "casement window",
  "sliding window",
  "window seepage",
  "window leak",
  "soundproof window",
  "low e glass",
  "aluminium window",
  "window replacement",
  "hdb window",
];

const out = await scrapeRenotalkForum({ queries, maxThreadsPerQuery: 8 });
await writeFile(join(RAW, "renotalk.json"), JSON.stringify(out, null, 2));
console.log(`✓ ${out.length} posts → renotalk.json`);
