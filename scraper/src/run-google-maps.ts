import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { scrapeGoogleMaps } from "./sources/google-maps";

const RAW = "./output/raw/";
await mkdir(RAW, { recursive: true });

// Real SG window contractors identified from §5 Competitor Teardown
const businesses = [
  "Home Aluminium Metal Works Singapore",
  "Ho Ho Door Singapore",
  "Top 1 Singapore Safety Window",
];

const reviewsPerBusiness = 30;

console.log(`google-maps: scraping ${businesses.length} businesses × ${reviewsPerBusiness} reviews`);
const out = await scrapeGoogleMaps({ businesses, reviewsPerBusiness });
await writeFile(join(RAW, "google-maps.json"), JSON.stringify(out, null, 2));
console.log(`✓ ${out.length} reviews → google-maps.json`);
