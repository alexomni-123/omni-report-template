import type { Phrase, RawComment, Source } from "../types";
import { scoreSentiment } from "./sentiment";

/**
 * Cluster phrases into pain-point categories using a manually-curated keyword map.
 * For v1 this is windows-vertical specific (in /clusters/window-sg.ts).
 * Later: pluggable per vertical.
 *
 * Output shape matches the Report.painPoints schema in the Next.js side.
 */

export type PainCluster = {
  id: string;
  label: string;
  matchers: RegExp[];
};

export type ClusteredPain = {
  id: string;
  label: string;
  intensity: number;
  sources: { client: number; reviews: number; reddit: number; forums: number };
  topPhrases: { text: string; count: number }[];
  citations: { url: string; snippet: string }[];
  sentiment: { avgNeg: number; hotQuotes: { url: string; snippet: string; score: number }[] };
};

const sourceBucket = (s: Source): keyof ClusteredPain["sources"] => {
  if (s === "reddit") return "reddit";
  if (s === "google-maps") return "reviews";
  if (s === "hardwarezone" || s === "renotalk" || s === "carousell") return "forums";
  return "client";
};

export function clusterPains(
  phrases: Phrase[],
  comments: RawComment[],
  clusters: PainCluster[]
): ClusteredPain[] {
  // For each cluster, collect matching phrases and matching comments
  const out: ClusteredPain[] = [];

  // Pre-compute counts per source for each comment
  for (const cluster of clusters) {
    const matchingComments = comments.filter((c) =>
      cluster.matchers.some((re) => re.test(c.body))
    );
    const sources = { client: 0, reviews: 0, reddit: 0, forums: 0 };
    for (const c of matchingComments) {
      sources[sourceBucket(c.source)]++;
    }

    const matchingPhrases = phrases
      .filter((p) => cluster.matchers.some((re) => re.test(p.text)))
      .slice(0, 8)
      .map((p) => ({ text: p.text, count: p.count }));

    const totalCitations = matchingComments.length;

    // Citations: pull up to 5 distinct, prefer high-signal sources (reviews + reddit)
    const seenUrls = new Set<string>();
    const citations: ClusteredPain["citations"] = [];
    const sourceOrder: Source[] = ["google-maps", "reddit", "hardwarezone", "renotalk", "carousell"];
    for (const src of sourceOrder) {
      for (const c of matchingComments) {
        if (c.source !== src) continue;
        if (seenUrls.has(c.url)) continue;
        seenUrls.add(c.url);
        citations.push({
          url: c.url,
          snippet: c.body.slice(0, 200) + (c.body.length > 200 ? "…" : ""),
        });
        if (citations.length >= 5) break;
      }
      if (citations.length >= 5) break;
    }

    // Sentiment: score every matching comment; surface the top-3 highest-negative quotes
    const scored = matchingComments
      .map((c) => ({
        url: c.url,
        snippet: c.body.slice(0, 280) + (c.body.length > 280 ? "…" : ""),
        score: scoreSentiment(c.body).neg,
      }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);
    const hotQuotes = scored.slice(0, 3);
    const avgNeg =
      matchingComments.length > 0
        ? matchingComments.reduce((s, c) => s + scoreSentiment(c.body).neg, 0) /
          matchingComments.length
        : 0;

    out.push({
      id: cluster.id,
      label: cluster.label,
      intensity: 0, // calibrated below
      sources,
      topPhrases: matchingPhrases,
      citations,
      sentiment: { avgNeg: Number(avgNeg.toFixed(2)), hotQuotes },
    });
  }

  // Calibrate intensity 0–100 by total citation count, log-scaled
  const max = Math.max(1, ...out.map((p) => p.sources.client + p.sources.reviews + p.sources.reddit + p.sources.forums));
  for (const p of out) {
    const total = p.sources.client + p.sources.reviews + p.sources.reddit + p.sources.forums;
    if (total === 0) {
      p.intensity = 0;
      continue;
    }
    // log-scale + scale to 0–100
    p.intensity = Math.round((Math.log1p(total) / Math.log1p(max)) * 100);
  }

  return out.sort((a, b) => b.intensity - a.intensity);
}
