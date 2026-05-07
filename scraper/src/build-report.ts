/**
 * Reads raw scraped output (output/raw/*.json), runs phrase extraction +
 * pain clustering, and writes a Report-shaped JSON to ../src/data/scraped/<slug>.json
 * that the Next.js page consumes.
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { existsSync } from "node:fs";
import { parse as parseYaml } from "yaml";
import type { RawComment, ScrapeRun } from "./types";
import { extractPhrases, type ExtractConfig } from "./nlp/extract-phrases";
import { clusterPains, type ClusteredPain } from "./nlp/cluster-pains";
import { windowSgClusters } from "./nlp/clusters/window-sg";

type Config = {
  clientName: string;
  clientWebsite: string;
  serviceArea: string;
  vertical: string;
  nlp: ExtractConfig;
  output: { reportPath: string; rawPath: string };
};

async function loadConfig(path: string): Promise<Config> {
  const raw = await readFile(path, "utf8");
  return parseYaml(raw) as Config;
}

async function loadRawComments(rawDir: string): Promise<RawComment[]> {
  if (!existsSync(rawDir)) {
    console.warn(`! raw dir not found: ${rawDir} — run a scrape first`);
    return [];
  }
  const files = (await readdir(rawDir)).filter((f) => f.endsWith(".json"));
  const all: RawComment[] = [];
  for (const f of files) {
    const c = JSON.parse(await readFile(join(rawDir, f), "utf8")) as RawComment[];
    all.push(...c);
  }
  return all;
}

/**
 * Map the clustered pains into the exact shape Section3PainPoints expects.
 * Adds optional `topPhrases` + `citations` alongside the existing structure so the
 * UI can show real customer phrases and citation links when available.
 */
/**
 * Filter out generic noise n-grams ("going to be", "want to know", etc.) before
 * the keyword list ships to the report.
 */
const NOISE_PATTERNS = [
  /^(going|want|need|trying|looking|asking|saying|telling)\s/i,
  /\b(thing|things|stuff|something|anything|nothing|someone)\b/i,
  /^\d+(\.\d+)?$/,
  /^[a-z]\b/, // single letters
];

function isNoise(text: string): boolean {
  if (text.length < 5) return true;
  return NOISE_PATTERNS.some((re) => re.test(text));
}

function pickTopKeywords(phrases: { text: string; count: number }[], topN = 30) {
  return phrases
    .filter((p) => !isNoise(p.text))
    .slice(0, topN)
    .map((p) => ({
      phrase: p.text,
      monthlyVolume: p.count, // mention count, not Google volume — schema-compatible
      stage: classifyStage(p.text),
    }));
}

function classifyStage(text: string): "problem" | "solution" | "brand" {
  const t = text.toLowerCase();
  // Problem-stage: pain language — the customer is describing what hurts
  if (
    /\b(leak(y|ing)?|noisy|loud|hot|mou?ld|mildew|condensation|seep(age|ing)|drip|drafty|stuffy|cant\s*sleep|cannot\s*sleep|bill\s*(high|expensive)|too\s*(hot|loud|noisy|expensive)|complain|frustrat|annoy|stuck|broken|jam(med)?|cracked?|rotten|rust(ed|ing)?|water\s*(in|inside|leak)|rain\s*(coming|getting|comes)|aircon\s*(bill|cost)|ugly|dated|old|worn)\b/i.test(
      t
    )
  )
    return "problem";

  // Brand-stage: vendor / company / specific-product names
  if (
    /\b(winsam|panemart|clearshield|review|reviews|recommend|recommended|best\s*contractor|best\s*window|reputable|trustworthy|legit)\b/i.test(
      t
    )
  )
    return "brand";

  // Solution-stage: product / contractor / process language
  if (
    /\b(low[\s-]?e|laminat|tempered|double[\s-]?glaz|triple[\s-]?glaz|casement|sliding|upvc|aluminum|aluminium|tinted|grille|contractor|installer|warranty|permit|hdb\s*permit|bca|application|approval|quote|quotation|cost|price|estimate|installation)\b/i.test(
      t
    )
  )
    return "solution";

  // If a phrase is just a noun naming the thing ("the windows", "casement window"), default to solution
  return "solution";
}

async function main() {
  const cfgPath = process.argv[2] ?? "config.yaml";
  const cfg = await loadConfig(cfgPath);

  const rawDir = cfg.output.rawPath;
  const comments = await loadRawComments(rawDir);
  console.log(`build-report: ${comments.length} comments loaded from ${rawDir}`);

  if (comments.length === 0) {
    console.log("! no comments to process — skipping report build");
    return;
  }

  const phrases = extractPhrases(comments, cfg.nlp);
  console.log(`build-report: ${phrases.length} candidate phrases (occ ≥ ${cfg.nlp.minOccurrences})`);

  const pains = clusterPains(phrases, comments, windowSgClusters);

  // Citation count summary by source
  const sourceTotals = comments.reduce<Record<string, number>>((acc, c) => {
    acc[c.source] = (acc[c.source] ?? 0) + 1;
    return acc;
  }, {});

  const report = {
    generatedAt: new Date().toISOString().slice(0, 10),
    generatedBy: "OMNI BRAIN Oracle (real-data scrape)",
    isRealData: true,
    sourceTotals,
    snapshot: {
      vertical: cfg.vertical,
      serviceArea: cfg.serviceArea,
      websiteUrl: cfg.clientWebsite,
      businessModel: "—",
      priceBand: "—",
      headline: "—",
    },
    painPoints: pains.map(
      (p: ClusteredPain) =>
        ({
          id: p.id,
          label: p.label,
          intensity: p.intensity,
          sources: p.sources,
          topPhrases: p.topPhrases,
          citations: p.citations,
        })
    ),
    keywords: pickTopKeywords(phrases),
    angles: [], // angles need human curation; left empty until human pass
    competitors: [],
    copyHooks: [],
    testPlan: [],
    icp: {
      ageBuckets: [],
      homeTypes: [],
      urgency: [],
      oneLine: "Awaiting human triangulation against ad-platform demographics.",
    },
  };

  const outPath = join(dirname(cfgPath), cfg.output.reportPath);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(report, null, 2));

  const summary: ScrapeRun = {
    config: cfgPath,
    startedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    bySource: Object.fromEntries(
      Object.entries(sourceTotals).map(([s, count]) => [
        s,
        { commentsScraped: count, durationMs: 0, errors: [] },
      ])
    ) as ScrapeRun["bySource"],
    totalComments: comments.length,
  };
  await writeFile(join(rawDir, "_run-summary.json"), JSON.stringify(summary, null, 2));

  console.log(`✓ wrote ${outPath}`);
  console.log(`  pains: ${pains.length} clusters, top intensity = ${pains[0]?.intensity ?? "—"}`);
  console.log(`  keywords: ${report.keywords.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
