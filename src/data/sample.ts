import type { Report } from "@/lib/types";

export const sampleReport: Report = {
  generatedAt: "2026-05-07",
  generatedBy: "OMNI BRAIN Oracle",
  snapshot: {
    vertical: "Window Installation & Replacement",
    serviceArea: "Greater Toronto Area, ON",
    businessModel: "Residential retrofit + new-build (B2C, 70/30 split)",
    priceBand: "Mid-premium ($850–$1,400 per window installed)",
    websiteUrl: "https://example-windows-co.ca",
    headline:
      "Energy-efficient triple-pane windows, installed in one day by certified GTA crews.",
  },
  icp: {
    ageBuckets: [
      { label: "35–44", share: 18 },
      { label: "45–54", share: 28 },
      { label: "55–64", share: 32 },
      { label: "65+", share: 22 },
    ],
    homeTypes: [
      { label: "Detached (1970s–90s)", share: 46 },
      { label: "Semi-detached", share: 22 },
      { label: "Townhouse", share: 18 },
      { label: "Bungalow", share: 14 },
    ],
    urgency: [
      { stage: "Problem-aware", share: 44 },
      { stage: "Solution-aware", share: 36 },
      { stage: "Ready-to-quote", share: 20 },
    ],
    oneLine:
      "Homeowners aged 45–64 in detached suburban homes built before 1995, motivated by energy bills and condensation, but skeptical after past contractor experiences.",
  },
  painPoints: [
    {
      id: "energy",
      label: "Heating loss / energy bills",
      intensity: 92,
      sources: { client: 8, reviews: 41, reddit: 27, forums: 14 },
    },
    {
      id: "noise",
      label: "Outside noise (traffic, neighbours)",
      intensity: 78,
      sources: { client: 5, reviews: 22, reddit: 18, forums: 9 },
    },
    {
      id: "condensation",
      label: "Condensation + mold around frames",
      intensity: 84,
      sources: { client: 6, reviews: 31, reddit: 24, forums: 11 },
    },
    {
      id: "drafts",
      label: "Drafts in winter",
      intensity: 71,
      sources: { client: 7, reviews: 28, reddit: 14, forums: 6 },
    },
    {
      id: "trust",
      label: "Installer trust / warranty fear",
      intensity: 88,
      sources: { client: 4, reviews: 47, reddit: 33, forums: 19 },
    },
    {
      id: "disruption",
      label: "Install disruption (mess, days off work)",
      intensity: 64,
      sources: { client: 9, reviews: 19, reddit: 12, forums: 4 },
    },
    {
      id: "aesthetic",
      label: "Dated aesthetic / curb appeal",
      intensity: 52,
      sources: { client: 3, reviews: 14, reddit: 9, forums: 3 },
    },
    {
      id: "cost",
      label: "Hidden cost / pricing opacity",
      intensity: 81,
      sources: { client: 2, reviews: 38, reddit: 29, forums: 16 },
    },
  ],
  keywords: [
    { phrase: "drafty windows in winter", monthlyVolume: 1900, stage: "problem" },
    { phrase: "condensation between window panes", monthlyVolume: 2400, stage: "problem" },
    { phrase: "high heating bill old windows", monthlyVolume: 880, stage: "problem" },
    { phrase: "windows letting in outside noise", monthlyVolume: 720, stage: "problem" },
    { phrase: "mold around window frame", monthlyVolume: 3100, stage: "problem" },

    { phrase: "triple pane vs double pane windows", monthlyVolume: 4400, stage: "solution" },
    { phrase: "best window replacement company toronto", monthlyVolume: 1600, stage: "solution" },
    { phrase: "energy efficient windows cost", monthlyVolume: 2700, stage: "solution" },
    { phrase: "vinyl vs fiberglass windows", monthlyVolume: 3600, stage: "solution" },
    { phrase: "window replacement rebate ontario", monthlyVolume: 1200, stage: "solution" },

    { phrase: "ecochoice windows reviews", monthlyVolume: 480, stage: "brand" },
    { phrase: "pella vs andersen windows", monthlyVolume: 2900, stage: "brand" },
    { phrase: "homedepot window installation reviews", monthlyVolume: 720, stage: "brand" },
  ],
  competitors: [
    {
      name: "EcoChoice Windows",
      url: "https://ecochoice.example.ca",
      heroHook: "Save 30% on heating — guaranteed in writing.",
      offer: "Free in-home quote + $500 off any 5-window package",
      proof: "8,400+ GTA installs · BBB A+ · 25-yr warranty",
    },
    {
      name: "PaneCraft",
      url: "https://panecraft.example.ca",
      heroHook: "Custom-fit windows, installed in one day.",
      offer: "0% financing for 24 months",
      proof: "Featured on CityLine · 4.9★ Google (1,200+ reviews)",
    },
    {
      name: "Northern Glass Co.",
      url: "https://northernglass.example.ca",
      heroHook: "The last windows you'll ever buy.",
      offer: "Lifetime transferable warranty",
      proof: "Family-owned since 1987 · 12,000+ installs",
    },
  ],
  angles: [
    {
      id: "winter-bill",
      name: "Winter Bill Killer",
      painIntensity: 92,
      keywordVolume: 7180,
      differentiation: 62,
      rank: 1,
    },
    {
      id: "mold-health",
      name: "Mold = Health Risk",
      painIntensity: 84,
      keywordVolume: 5500,
      differentiation: 78,
      rank: 2,
    },
    {
      id: "trust-warranty",
      name: "Skip the Warranty Trap",
      painIntensity: 88,
      keywordVolume: 2100,
      differentiation: 71,
      rank: 3,
    },
    {
      id: "one-day",
      name: "One-Day Install",
      painIntensity: 64,
      keywordVolume: 1100,
      differentiation: 55,
      rank: 4,
    },
    {
      id: "noise-sleep",
      name: "Sleep Through Anything",
      painIntensity: 78,
      keywordVolume: 720,
      differentiation: 81,
      rank: 5,
    },
    {
      id: "rebate",
      name: "Ontario Rebate Stacking",
      painIntensity: 81,
      keywordVolume: 1200,
      differentiation: 68,
      rank: 6,
    },
    {
      id: "transferable",
      name: "Adds Resale Value",
      painIntensity: 52,
      keywordVolume: 980,
      differentiation: 47,
      rank: 7,
    },
  ],
  copyHooks: [
    {
      angleId: "winter-bill",
      stage: "problem",
      headline: "Heating bill went up again this winter? It's probably your windows.",
      openingLine:
        "Homes built before 1995 leak up to 30% of their heat through old window seals — and Hydro is happy to charge you for it.",
    },
    {
      angleId: "mold-health",
      stage: "problem",
      headline: "That black ring around your window? It's not dirt.",
      openingLine:
        "Condensation between panes feeds mold — and mold near your bedroom is a respiratory issue, not a cleaning issue.",
    },
    {
      angleId: "trust-warranty",
      stage: "solution",
      headline: "Read the warranty before you sign. Most don't.",
      openingLine:
        "A 'lifetime warranty' that voids if a previous owner installed the windows is not a warranty — it's a marketing line.",
    },
    {
      angleId: "one-day",
      stage: "solution",
      headline: "Windows installed before you finish your morning coffee.",
      openingLine:
        "Our crews replace a typical home's windows in a single day. No tarps for a week. No half-finished living room.",
    },
    {
      angleId: "noise-sleep",
      stage: "problem",
      headline: "Hearing every car at 6am isn't normal. It's your windows.",
      openingLine:
        "Triple-pane glass cuts outside noise by up to 22 decibels — about the difference between a busy street and a library.",
    },
    {
      angleId: "rebate",
      stage: "solution",
      headline: "Ontario will pay up to $5,000 of your window upgrade.",
      openingLine:
        "Most homeowners don't know the Greener Homes rebate stacks with the federal tax credit. We file both for you.",
    },
    {
      angleId: "transferable",
      stage: "brand",
      headline: "The one upgrade buyers actually pay extra for.",
      openingLine:
        "Realtors will tell you new kitchens recoup 60%. Energy-efficient windows recoup 78% — and show in every listing photo.",
    },
  ],
  testPlan: [
    {
      order: 1,
      angleName: "Winter Bill Killer",
      format: "Static carousel (Meta + IG)",
      primaryCopy:
        "Slide 1: $-graph going up | Slide 2: thermal-image of leaky window | Slide 3: rebate offer",
      cta: "Get my free heating-loss audit →",
      rationale: "Highest pain × highest volume. Cold-traffic workhorse.",
    },
    {
      order: 2,
      angleName: "Mold = Health Risk",
      format: "15s UGC video (TikTok + Reels)",
      primaryCopy:
        "Hook: 'Wipe this off your window every morning? Here's what's actually growing.' Show condensation → mold reveal → solution.",
      cta: "Book your free inspection →",
      rationale: "High emotional intensity, strong differentiation. Best for women 45–64.",
    },
    {
      order: 3,
      angleName: "Skip the Warranty Trap",
      format: "Long-form Meta lead-ad (1,200-word body)",
      primaryCopy:
        "Side-by-side comparison of 3 competitor warranties — what's actually covered, what's voided. Lead magnet: 'The 7 Warranty Clauses That Cancel Your Coverage.'",
      cta: "Send me the warranty checklist →",
      rationale: "Captures the 20% ready-to-quote audience comparing vendors. Lower volume, highest intent.",
    },
  ],
};
