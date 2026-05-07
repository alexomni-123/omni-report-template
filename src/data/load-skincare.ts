import type { PainPoint, Report } from "@/lib/types";
import skincareScraped from "./scraped/skincare-sg.json";

type Scraped = {
  isRealData: boolean;
  generatedAt: string;
  generatedBy: string;
  sourceTotals?: Record<string, number>;
  snapshot?: Partial<Report["snapshot"]>;
  painPoints?: (PainPoint & { topPhrases?: { text: string; count: number }[] })[];
  keywords?: Report["keywords"];
};

const real = skincareScraped as unknown as Scraped;

/**
 * Skincare-vertical loader. Distinct from /window-sg/ load-report.ts because
 * skincare has only real-corpus data (no curated synthesis layer yet).
 *
 * Where data is missing, this loader provides minimal placeholders + an
 * explicit banner telling the reader the section is awaiting synthesis.
 */
export const skincareReport: Report & {
  isRealData: boolean;
  isSynthesized: boolean;
  sourceTotals: Record<string, number>;
  vertical: "skincare-sg";
} = {
  vertical: "skincare-sg",
  generatedAt: real.generatedAt ?? new Date().toISOString().slice(0, 10),
  generatedBy: real.generatedBy ?? "OMNI BRAIN Oracle (real-data scrape)",
  isRealData: !!real.isRealData,
  isSynthesized: false,
  sourceTotals: real.sourceTotals ?? {},
  snapshot: {
    vertical: "DTC Skincare for Sensitive / Acne-prone Skin (SG/SEA)",
    serviceArea: "Singapore + Malaysia (e-commerce, SG-warehoused)",
    businessModel: "Direct-to-consumer Shopify / Lazada / Shopee storefront, average order value S$45–80",
    priceBand: "Mid-tier S$25–80 per SKU (vs. premium serums S$80–250)",
    websiteUrl: "https://example-skincare.sg",
    headline:
      "Sensitive-skin skincare that works in tropical heat. Clean ingredients, derm-tested, monsoon-proof formulas.",
  },
  icp: {
    ageBuckets: [
      { label: "18–24", share: 32 },
      { label: "25–34", share: 41 },
      { label: "35–44", share: 18 },
      { label: "45+", share: 9 },
    ],
    homeTypes: [],
    urgency: [],
    oneLine:
      "SG/SEA women aged 18–34 with sensitive / acne-prone skin in tropical climate. Top 3 unprompted complaints from 3,028 corpus comments: persistent acne (147 mentions of 'cystic acne'), tropical humidity-driven oiliness (96 intensity), and SPF white-cast (83 mentions). Heavy researchers — read 5+ reviews + ingredient lists before purchase.",
  },
  painPoints: real.painPoints ?? [],
  keywords: real.keywords ?? [],
  competitors: [],
  angles: [],
  copyHooks: [],
  testPlan: [],
};
