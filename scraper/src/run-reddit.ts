import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { parse as parseYaml } from "yaml";
import { scrapeReddit, type RedditConfig } from "./sources/reddit";

const cfgPath = process.argv[2] ?? "config.yaml";
const cfg = parseYaml(await readFile(cfgPath, "utf8")) as {
  reddit: RedditConfig;
  output: { rawPath: string };
};
const rawDir = join(dirname(cfgPath), cfg.output.rawPath);
await mkdir(rawDir, { recursive: true });
const comments = await scrapeReddit(cfg.reddit);
await writeFile(join(rawDir, "reddit.json"), JSON.stringify(comments, null, 2));
console.log(`✓ ${comments.length} comments → ${join(rawDir, "reddit.json")}`);
