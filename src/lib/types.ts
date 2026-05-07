export type AwarenessStage = "problem" | "solution" | "brand";

export type Snapshot = {
  vertical: string;
  serviceArea: string;
  businessModel: string;
  priceBand: string;
  websiteUrl: string;
  headline: string;
};

export type ICP = {
  ageBuckets: { label: string; share: number }[];
  homeTypes: { label: string; share: number }[];
  urgency: { stage: string; share: number }[];
  oneLine: string;
};

export type PainPoint = {
  id: string;
  label: string;
  intensity: number;
  sources: { client: number; reviews: number; reddit: number; forums: number };
  topPhrases?: { text: string; count: number }[];
  citations?: { url: string; snippet: string }[];
  evidence?: { quote: string; url: string; thread: string }[];
};

export type Keyword = {
  phrase: string;
  monthlyVolume: number;
  stage: AwarenessStage;
};

export type Competitor = {
  name: string;
  url: string;
  heroHook: string;
  offer: string;
  proof: string;
};

export type Angle = {
  id: string;
  name: string;
  painIntensity: number;
  keywordVolume: number;
  differentiation: number;
  rank: number;
};

export type CopyHook = {
  angleId: string;
  stage: AwarenessStage;
  headline: string;
  openingLine: string;
};

export type TestPlanCreative = {
  order: number;
  angleName: string;
  format: string;
  primaryCopy: string;
  cta: string;
  rationale: string;
};

export type Report = {
  generatedAt: string;
  generatedBy: string;
  snapshot: Snapshot;
  icp: ICP;
  painPoints: PainPoint[];
  keywords: Keyword[];
  competitors: Competitor[];
  angles: Angle[];
  copyHooks: CopyHook[];
  testPlan: TestPlanCreative[];
};
