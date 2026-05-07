import type { Report } from "@/lib/types";
import { sampleReport } from "./sample";
import scraped from "./scraped/window-sg.json";

type ScrapedReport = {
  isRealData: boolean;
  sourceTotals?: Record<string, number>;
  painPoints?: Report["painPoints"];
  keywords?: Report["keywords"];
};

const real = scraped as unknown as ScrapedReport;

/**
 * The page reads from this loader. When the scraper has written real data
 * (`isRealData: true`), pain points and keywords come from the scrape;
 * everything else still comes from the curated sample (until v2 generates them).
 */
export const report: Report & { isRealData: boolean; sourceTotals: Record<string, number> } = {
  ...sampleReport,
  isRealData: !!real.isRealData,
  sourceTotals: real.sourceTotals ?? {},
  painPoints:
    real.isRealData && real.painPoints && real.painPoints.length
      ? real.painPoints
      : sampleReport.painPoints,
  keywords:
    real.isRealData && real.keywords && real.keywords.length
      ? real.keywords
      : sampleReport.keywords,
};
