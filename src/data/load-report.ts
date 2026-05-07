import type { Report, PainPoint } from "@/lib/types";
import { sampleReport } from "./sample";
import scraped from "./scraped/window-sg.json";
import suggestRaw from "./scraped/window-sg-suggest.json";
import icpInferred from "./scraped/window-sg-icp.json";
import {
  synthesizedAngles,
  synthesizedCompetitorGap,
  synthesizedCompetitors,
  synthesizedCopyHooks,
  synthesizedICPOneLine,
  synthesizedPains,
  synthesizedPressContext,
  synthesizedSnapshot,
  synthesizedTestPlan,
  type Evidence,
} from "./synthesis";

type ScrapedReport = {
  isRealData: boolean;
  sourceTotals?: Record<string, number>;
  painPoints?: Report["painPoints"];
  keywords?: Report["keywords"];
};

const real = scraped as unknown as ScrapedReport;

/**
 * Merge precedence: synthesis (LLM-curated) > scraped (regex-clustered) > sample (fabricated).
 *
 * The page UI renders different banners depending on which layer is active so the
 * reader always knows what's grounded in real data and what is illustrative.
 */

const isReal = !!real.isRealData;

// Pain points: prefer scraped (with real intensities + citations), then layer in
// synthesized evidence quotes.
const painPoints: (PainPoint & { evidence?: Evidence[] })[] = (
  isReal && real.painPoints?.length ? real.painPoints : sampleReport.painPoints
).map((p) => ({
  ...p,
  evidence: synthesizedPains[p.id]?.evidence,
}));

export const report = {
  ...sampleReport,
  isRealData: isReal,
  isSynthesized: true,
  sourceTotals: real.sourceTotals ?? {},
  snapshot: synthesizedSnapshot,
  icp: {
    ...sampleReport.icp,
    oneLine: synthesizedICPOneLine,
    homeTypes:
      icpInferred.homeTypes && icpInferred.homeTypes.length > 0
        ? icpInferred.homeTypes.map((h: { label: string; share: number }) => ({
            label: h.label,
            share: h.share,
          }))
        : sampleReport.icp.homeTypes,
    urgency:
      icpInferred.urgency && icpInferred.urgency.length > 0
        ? icpInferred.urgency.map((u: { label: string; share: number }) => ({
            stage: u.label,
            share: u.share,
          }))
        : sampleReport.icp.urgency,
  },
  icpInferred,
  painPoints,
  keywords: isReal && real.keywords?.length ? real.keywords : sampleReport.keywords,
  // Synthesis layer always wins for narrative outputs (when present)
  angles: synthesizedAngles.length ? synthesizedAngles : sampleReport.angles,
  copyHooks: synthesizedCopyHooks.length ? synthesizedCopyHooks : sampleReport.copyHooks,
  testPlan: synthesizedTestPlan.length ? synthesizedTestPlan : sampleReport.testPlan,
  competitors: synthesizedCompetitors.length ? synthesizedCompetitors : sampleReport.competitors,
  competitorGap: synthesizedCompetitorGap,
  googleSuggest: suggestRaw as { seed: string; suggestions: string[] }[],
  pressContext: synthesizedPressContext,
};
