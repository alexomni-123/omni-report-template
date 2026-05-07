import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { scrapeHardwarezone } from "./sources/hardwarezone";

const RAW = "./output/raw/";
await mkdir(RAW, { recursive: true });

const queries = ["window casement", "hdb window", "soundproof window", "window seepage", "low e glass"];

const out = await scrapeHardwarezone({ queries, maxThreadsPerQuery: 5 });
await writeFile(join(RAW, "hardwarezone.json"), JSON.stringify(out, null, 2));
console.log(`✓ ${out.length} posts → hardwarezone.json`);
