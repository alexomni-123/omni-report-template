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
import { windowSgClusters, windowSgStageMatchers } from "./nlp/clusters/window-sg";
import { skincareSgClusters, skincareSgStageMatchers } from "./nlp/clusters/skincare-sg";

type StageMatchers = { problem: RegExp; brand: RegExp; solution: RegExp };

const CLUSTERS_BY_VERTICAL: Record<string, typeof windowSgClusters> = {
  "window-sg": windowSgClusters,
  "skincare-sg": skincareSgClusters,
};

const STAGE_MATCHERS_BY_VERTICAL: Record<string, StageMatchers> = {
  "window-sg": windowSgStageMatchers,
  "skincare-sg": skincareSgStageMatchers,
};

type Config = {
  clientName: string;
  clientWebsite: string;
  serviceArea: string;
  vertical: string;
  clustersKey?: string; // 'window-sg', 'skincare-sg', etc. — defaults to window-sg for backwards compat
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
  const files = (await readdir(rawDir)).filter(
    (f) => f.endsWith(".json") && !f.startsWith("_")
  );
  const all: RawComment[] = [];
  for (const f of files) {
    const parsed = JSON.parse(await readFile(join(rawDir, f), "utf8"));
    if (Array.isArray(parsed)) all.push(...(parsed as RawComment[]));
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
  /^(the|a|an|some|any|every|each)\s/i, // definite/indefinite articles carry no intent signal
  /^(going|want|need|trying|looking|asking|saying|telling|got|getting)\s/i,
  /\b(thing|things|stuff|something|anything|nothing|someone|people|guys?)\b/i,
  /^(my|your|his|her|their|our)\s/i, // possessives are mostly generic
  /^(more|less|few|many|much)\s+than\b/i, // comparison fragments
  /^(away|coming|going|back|down|up|out|in)\s+(from|to)\b/i, // prepositional fragments
  /\s(than|that|which|who|whom|whose|when|where|why|how|because|but|so)\b/i, // mid-sentence connectors
  /^\d+(\.\d+)?$/,
  /^[a-z]\b/, // single letters
  /^(yes|no|ok|lol|haha|btw|fyi|imo|imho|cigarette\s*smoke)\b/i,
];

const GENERIC_BIGRAMS = new Set([
  "living room",
  "bed room",
  "bedroom window", // too generic; let "casement window" / "sliding window" win
  "the design",
  "able open",
  "sense from",
  "perspective just",
  "year old", // ambiguous (window age vs person age)
  "next time",
  "don't know",
  "don't think",
  "water bed", // false positive vs "water seepage"
  // off-topic threads that slipped through the on-topic filter
  "sbs transit",
  "double decker",
  "bus service",
  "cigarette smoke",
]);

function isNoise(text: string): boolean {
  if (text.length < 5) return true;
  if (GENERIC_BIGRAMS.has(text)) return true;
  return NOISE_PATTERNS.some((re) => re.test(text));
}

function pickTopKeywords(
  phrases: { text: string; count: number }[],
  stageMatchers: StageMatchers,
  topN = 30
) {
  return phrases
    .filter((p) => !isNoise(p.text))
    .slice(0, topN)
    .map((p) => ({
      phrase: p.text,
      monthlyVolume: p.count, // mention count, not Google volume — schema-compatible
      stage: classifyStage(p.text, stageMatchers),
    }));
}

function classifyStage(
  text: string,
  m: StageMatchers
): "problem" | "solution" | "brand" {
  const t = text.toLowerCase();
  if (m.problem.test(t)) return "problem";
  if (m.brand.test(t)) return "brand";
  if (m.solution.test(t)) return "solution";
  return "solution"; // default — bare-noun phrases
}

// Legacy fallback (kept for reference; no longer called)
function _classifyStageWindowLegacy(text: string): "problem" | "solution" | "brand" {
  const t = text.toLowerCase();
  // Problem-stage: pain language — the customer is describing what hurts
  if (
    /\b(leak(y|ing|s)?|noisy|loud|noise\s*pollution|mou?ld(y)?|mildew|condensation|seep(age|ing)?|drip|drafty|stuffy|sleep(less)?|insomnia|cant\s*sleep|cannot\s*sleep|wake\s*up|woken|disturb(ed|ing)?|bill\s*(high|expensive|crazy|insane)|too\s*(hot|loud|noisy|expensive|warm)|complain|frustrat|annoy|stuck|broken|jam(med)?|cracked?|rotten|rust(ed|ing)?|hate|terrible|awful|nightmare|disgust(ing)?|water\s*(in|inside|leak|seep)|rain\s*(coming|getting|comes|hits|in)|aircon\s*(bill|cost|crazy|broken|24)|electric(ity)?\s*bill|ugly|dated|old|worn|disrepair|deterior|gave\s*up)\b/i.test(
      t
    )
  )
    return "problem";

  // Brand-stage: vendor / company / specific-product names + comparison intent
  if (
    /\b(home\s*aluminium|hoho|ho\s*ho\s*door|top\s*1\s*window|panemart|clearshield|winsam|reviews?|recommend(ed)?|best\s*(contractor|window|installer)|reputable|trustworthy|legit|vs\.?\s*\w|compared\s*to|which\s*is\s*better)\b/i.test(
      t
    )
  )
    return "brand";

  // Solution-stage: product / contractor / process language
  if (
    /\b(low[\s-]?e|laminat|tempered|double[\s-]?glaz|triple[\s-]?glaz|casement|sliding|upvc|aluminium|aluminum|tinted|grille|contractor|installer|warranty|permit|hdb\s*permit|bca|application|approval|quote|quotation|cost|price|estimate|installation|sound[\s-]?proof|insulat|sealant|silicone|caulk(ing)?)\b/i.test(
      t
    )
  )
    return "solution";

  // Default: if it's a bare noun phrase with no signal, mark as solution but it'll be deprioritized by frequency
  return "solution";
}

async function main() {
  const cfgPath = process.argv[2] ?? "config.yaml";
  const cfg = await loadConfig(cfgPath);

  const rawDir = join(dirname(cfgPath), cfg.output.rawPath);
  const all = await loadRawComments(rawDir);
  console.log(`build-report: ${all.length} comments loaded from ${rawDir}`);

  // Topic filter: derive from the vertical's clusters so it generalizes —
  // a comment is "on topic" if it matches any cluster regex OR if its thread
  // title does. Falls back to the previous SG-window topic regex when clusters
  // aren't yet loaded (defensive).
  const clustersKey = cfg.clustersKey ?? "window-sg";
  const clusters = CLUSTERS_BY_VERTICAL[clustersKey];
  if (!clusters) {
    console.error(`! unknown clustersKey "${clustersKey}". Available: ${Object.keys(CLUSTERS_BY_VERTICAL).join(", ")}`);
    process.exit(1);
  }
  const onTopic = (text: string) => clusters.some((c) => c.matchers.some((re) => re.test(text)));
  const comments = all.filter((c) => {
    const title = c.context?.threadTitle ?? "";
    return onTopic(c.body) || (title && onTopic(title));
  });
  console.log(`build-report: ${comments.length} on-topic comments after filter`);

  if (comments.length === 0) {
    console.log("! no on-topic comments — skipping report build");
    return;
  }

  const phrases = extractPhrases(comments, cfg.nlp);
  console.log(`build-report: ${phrases.length} candidate phrases (occ ≥ ${cfg.nlp.minOccurrences})`);

  console.log(`build-report: clustering with "${clustersKey}" (${clusters.length} clusters)`);
  const pains = clusterPains(phrases, comments, clusters);

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
    painPoints: pains.map((p: ClusteredPain) => ({
      id: p.id,
      label: p.label,
      intensity: p.intensity,
      sources: p.sources,
      topPhrases: p.topPhrases,
      citations: p.citations,
      sentiment: p.sentiment,
    })),
    keywords: pickTopKeywords(phrases, STAGE_MATCHERS_BY_VERTICAL[clustersKey] ?? windowSgStageMatchers),
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
