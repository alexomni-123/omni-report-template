/**
 * ICP demographic inference from the on-topic corpus.
 *
 * We can't extract real age/gender from Reddit/Renotalk usernames. What we
 * CAN extract: language markers that correlate with life stage, home type,
 * geography, and tenure. Each marker is loose; aggregate over 1,500+ comments
 * and rough distributions emerge.
 *
 * Output is honest — the page banner notes this is an inference, not census.
 */
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { RawComment } from "./types";

async function load(): Promise<RawComment[]> {
  const rawDir = "./output/raw/";
  const files = (await readdir(rawDir)).filter((f) => f.endsWith(".json") && !f.startsWith("_"));
  const all: RawComment[] = [];
  for (const f of files) {
    const parsed = JSON.parse(await readFile(join(rawDir, f), "utf8"));
    if (Array.isArray(parsed)) all.push(...(parsed as RawComment[]));
  }
  return all;
}

const ON_TOPIC_RE =
  /\b(window|casement|sliding|glaz|seepage|leak|aircon|aluminum|aluminium|upvc|frame|hdb\s*reno|reno(vation)?|noise|insulat|sound[- ]?proof|rain|monsoon|mou?ld|condensation|town\s*council)\b/i;

// Demographic-marker regexes
const HOME_TYPES: { id: string; label: string; matchers: RegExp[] }[] = [
  { id: "hdb_4r", label: "HDB 4-room", matchers: [/\b4[-\s]?room|4r\b|4rm\b/i] },
  { id: "hdb_5r", label: "HDB 5-room / executive", matchers: [/\b5[-\s]?room|5r\b|5rm\b|executive\s*hdb|exec\s*flat/i] },
  { id: "hdb_3r", label: "HDB 3-room / smaller", matchers: [/\b3[-\s]?room|3r\b|3rm\b|2[-\s]?room/i] },
  { id: "condo", label: "Condo / private apartment", matchers: [/\bcondo|condominium|condo\s*unit/i] },
  { id: "landed", label: "Landed (terrace / semi-D / bungalow)", matchers: [/\bland(ed)?\s*(home|prop|hous)|terrace\s*house|semi[-\s]?d\b|bungalow|cluster/i] },
];

const LIFE_STAGES: { id: string; label: string; matchers: RegExp[] }[] = [
  { id: "newlyweds", label: "Newlyweds / BTO first-timers (28–38)", matchers: [/\bnew(ly)?\s*wed|first[-\s]?time\s*buyer|first\s*home|bto\b/i] },
  { id: "young_family", label: "Young family with kids (32–45)", matchers: [/\bbaby|toddler|young\s*kids?|nursery|kindergarten|crib|school[-\s]?going/i] },
  { id: "established_family", label: "Established family (40–55)", matchers: [/\bteenager|sec(ondary)?\s*school|jc\b|polytechnic|study\s*room|kid'?s?\s*room/i] },
  { id: "empty_nesters", label: "Empty nesters (50–65)", matchers: [/\bdownsiz|empty[-\s]?nest|kids\s*move(d)?\s*out|grand(kid|child)|grandma|grandpa|retire(d|ment)?/i] },
  { id: "elderly", label: "Elderly / multigen (60+)", matchers: [/\b(elderly\s*parent|aged\s*parent|in[-\s]?laws|3[-\s]?gen|multigen|mama|papa|aunty|uncle\b)/i] },
];

const SG_TOWNS = [
  "Ang Mo Kio", "Bedok", "Bishan", "Boon Lay", "Bukit Batok", "Bukit Merah", "Bukit Panjang",
  "Bukit Timah", "Choa Chu Kang", "Clementi", "Geylang", "Hougang", "Jurong East", "Jurong West",
  "Kallang", "Marine Parade", "Pasir Ris", "Punggol", "Queenstown", "Sembawang", "Sengkang",
  "Serangoon", "Tampines", "Tiong Bahru", "Toa Payoh", "Woodlands", "Yishun",
];

const URGENCY_MARKERS: { id: string; label: string; matchers: RegExp[] }[] = [
  { id: "problem_aware", label: "Problem-aware", matchers: [/\b(thinking|considering|wondering|should\s*i|suspect|might\s*need|been\s*meaning)\b/i] },
  { id: "solution_aware", label: "Solution-aware", matchers: [/\b(quote|quotation|comparing|reading\s*reviews|narrowed\s*down|deciding\s*between|short[-\s]?list)\b/i] },
  { id: "ready_to_quote", label: "Ready-to-quote", matchers: [/\b(installing|booked|scheduled|deposit|signed|confirmed|installer\s*coming)\b/i] },
];

function bucket(comments: RawComment[], buckets: typeof HOME_TYPES) {
  const counts: Record<string, number> = {};
  buckets.forEach((b) => (counts[b.id] = 0));
  for (const c of comments) {
    for (const b of buckets) {
      if (b.matchers.some((re) => re.test(c.body))) counts[b.id]++;
    }
  }
  const total = Object.values(counts).reduce((s, n) => s + n, 0) || 1;
  return buckets
    .map((b) => ({ id: b.id, label: b.label, count: counts[b.id], share: Math.round((counts[b.id] / total) * 100) }))
    .filter((b) => b.count > 0);
}

async function main() {
  const all = await load();
  const onTopic = all.filter((c) => ON_TOPIC_RE.test(c.body) || ON_TOPIC_RE.test(c.context?.threadTitle ?? ""));
  console.log(`infer-icp: ${onTopic.length} on-topic comments`);

  const homeTypes = bucket(onTopic, HOME_TYPES);
  const lifeStages = bucket(onTopic, LIFE_STAGES);
  const urgency = bucket(onTopic, URGENCY_MARKERS);

  // Geo: count town mentions
  const geoCounts: Record<string, number> = {};
  for (const c of onTopic) {
    for (const town of SG_TOWNS) {
      if (new RegExp(`\\b${town}\\b`, "i").test(c.body)) {
        geoCounts[town] = (geoCounts[town] ?? 0) + 1;
      }
    }
  }
  const geo = Object.entries(geoCounts)
    .map(([town, count]) => ({ town, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    corpusSize: onTopic.length,
    note: "Inferred from language markers in the scraped corpus, not census. Markers are loose proxies for life stage / home type / urgency. Validate against client-side data (Meta Ads Library audience inference, GA4) before finalizing.",
    homeTypes,
    lifeStages,
    urgency,
    geo,
  };

  await mkdir("../src/data/scraped/", { recursive: true });
  await writeFile("../src/data/scraped/window-sg-icp.json", JSON.stringify(out, null, 2));

  console.log("home types:", homeTypes.map((h) => `${h.label}: ${h.count}`).join(", "));
  console.log("life stages:", lifeStages.map((h) => `${h.label}: ${h.count}`).join(", "));
  console.log("urgency:", urgency.map((h) => `${h.label}: ${h.count}`).join(", "));
  console.log("top towns:", geo.slice(0, 5).map((g) => `${g.town}: ${g.count}`).join(", "));
}

main();
