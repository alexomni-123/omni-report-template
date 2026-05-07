import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { scrapeReddit, type RedditConfig } from "./sources/reddit";

const cfgPath = process.argv[2] ?? "config.yaml";
const cfg = parseYaml(await readFile(cfgPath, "utf8")) as {
  reddit: RedditConfig;
  output: { rawPath: string };
};
await mkdir(cfg.output.rawPath, { recursive: true });
const comments = await scrapeReddit(cfg.reddit);
await writeFile(join(cfg.output.rawPath, "reddit.json"), JSON.stringify(comments, null, 2));
console.log(`✓ ${comments.length} comments → reddit.json`);
