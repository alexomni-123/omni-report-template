import type { Report } from "@/lib/types";

export const sampleReport: Report = {
  generatedAt: "2026-05-07",
  generatedBy: "OMNI BRAIN Oracle",
  snapshot: {
    vertical: "HDB & Condo Window Replacement",
    serviceArea: "Singapore (island-wide, HDB-towns priority)",
    businessModel: "B2C residential — HDB retrofit + condo casement upgrades (75/25 split)",
    priceBand: "Mid-tier (S$420–S$880 per window installed)",
    websiteUrl: "https://example-windows.sg",
    headline:
      "BCA-approved window contractors. Casement, sliding, and low-E glass — installed and HDB-permitted in 14 days.",
  },
  icp: {
    ageBuckets: [
      { label: "30–39", share: 22 },
      { label: "40–49", share: 31 },
      { label: "50–59", share: 28 },
      { label: "60+", share: 19 },
    ],
    homeTypes: [
      { label: "HDB 4-room (1990s–2000s)", share: 41 },
      { label: "HDB 5-room / executive", share: 24 },
      { label: "Condo (older mass-market)", share: 22 },
      { label: "Landed / cluster", share: 13 },
    ],
    urgency: [
      { stage: "Problem-aware", share: 38 },
      { stage: "Solution-aware", share: 41 },
      { stage: "Ready-to-quote", share: 21 },
    ],
    oneLine:
      "Singaporean HDB upgraders and condo owners aged 35–55, dealing with monsoon seepage, MRT/road noise, or rising aircon bills — research-heavy buyers who compare 3+ contractors before committing.",
  },
  painPoints: [
    {
      id: "noise",
      label: "MRT / road / aircon-compressor noise",
      intensity: 90,
      sources: { client: 7, reviews: 38, reddit: 24, forums: 21 },
    },
    {
      id: "heat",
      label: "Heat gain / soaring aircon bills",
      intensity: 87,
      sources: { client: 8, reviews: 33, reddit: 22, forums: 15 },
    },
    {
      id: "seepage",
      label: "Monsoon water seepage at frame / sill",
      intensity: 92,
      sources: { client: 6, reviews: 44, reddit: 31, forums: 26 },
    },
    {
      id: "mold",
      label: "Humidity + mold around frames",
      intensity: 78,
      sources: { client: 5, reviews: 27, reddit: 18, forums: 12 },
    },
    {
      id: "hdb-approval",
      label: "HDB approval / BCA paperwork anxiety",
      intensity: 81,
      sources: { client: 9, reviews: 22, reddit: 28, forums: 17 },
    },
    {
      id: "trust",
      label: "Contractor trust / vanishing-warranty fear",
      intensity: 85,
      sources: { client: 4, reviews: 49, reddit: 36, forums: 23 },
    },
    {
      id: "disruption",
      label: "Mess + disruption (kids, elderly, WFH)",
      intensity: 71,
      sources: { client: 6, reviews: 19, reddit: 14, forums: 6 },
    },
    {
      id: "cost",
      label: "Hidden cost / opaque quotes (debris, hoist, GST)",
      intensity: 79,
      sources: { client: 3, reviews: 41, reddit: 27, forums: 14 },
    },
  ],
  keywords: [
    { phrase: "water seepage from window during rain hdb", monthlyVolume: 1700, stage: "problem" },
    { phrase: "soundproof windows for mrt noise", monthlyVolume: 2200, stage: "problem" },
    { phrase: "aircon bill keeps going up small flat", monthlyVolume: 880, stage: "problem" },
    { phrase: "mold around window frame singapore", monthlyVolume: 1400, stage: "problem" },
    { phrase: "casement window leaking when raining", monthlyVolume: 1100, stage: "problem" },

    { phrase: "casement vs sliding window hdb", monthlyVolume: 3200, stage: "solution" },
    { phrase: "best window contractor singapore", monthlyVolume: 2900, stage: "solution" },
    { phrase: "low e glass window singapore price", monthlyVolume: 1800, stage: "solution" },
    { phrase: "double glazed windows hdb cost", monthlyVolume: 2400, stage: "solution" },
    { phrase: "bca approved window contractor", monthlyVolume: 1300, stage: "solution" },
    { phrase: "hdb window replacement permit", monthlyVolume: 980, stage: "solution" },
    { phrase: "aluminum vs upvc windows singapore", monthlyVolume: 1600, stage: "solution" },

    { phrase: "winsam windows reviews", monthlyVolume: 520, stage: "brand" },
    { phrase: "panemart window installation review hdb", monthlyVolume: 410, stage: "brand" },
  ],
  competitors: [
    {
      name: "WinSam Engineering",
      url: "https://winsam.example.sg",
      heroHook: "MRT-quiet bedrooms, HDB-permitted in 14 days.",
      offer: "Free in-home decibel test + S$300 off any 4-window casement set",
      proof: "BCA-licensed L4 · 11,000+ HDB installs · 8-yr workmanship warranty",
    },
    {
      name: "PaneMart Glazing",
      url: "https://panemart.example.sg",
      heroHook: "Low-E glass that cuts your aircon bill — guaranteed in writing.",
      offer: "0% interest 12-mo instalment via DBS / OCBC",
      proof: "Featured on CNA Lifestyle · 4.8★ Google (1,800+ reviews)",
    },
    {
      name: "ClearShield SG",
      url: "https://clearshield.example.sg",
      heroHook: "No more monsoon seepage. We seal what others skip.",
      offer: "Lifetime no-leak warranty (transferable on resale)",
      proof: "Family-owned since 1998 · 14,000+ Singapore installs",
    },
  ],
  angles: [
    {
      id: "monsoon-seal",
      name: "Monsoon Seal Guarantee",
      painIntensity: 92,
      keywordVolume: 2800,
      differentiation: 81,
      rank: 1,
    },
    {
      id: "aircon-bill",
      name: "Aircon Bill Killer (Low-E)",
      painIntensity: 87,
      keywordVolume: 4680,
      differentiation: 64,
      rank: 2,
    },
    {
      id: "mrt-quiet",
      name: "MRT-Quiet Bedrooms",
      painIntensity: 90,
      keywordVolume: 3300,
      differentiation: 76,
      rank: 3,
    },
    {
      id: "hdb-easy",
      name: "HDB Permit, Done For You",
      painIntensity: 81,
      keywordVolume: 2280,
      differentiation: 69,
      rank: 4,
    },
    {
      id: "trust-warranty",
      name: "Skip the Vanishing-Warranty Trap",
      painIntensity: 85,
      keywordVolume: 1700,
      differentiation: 72,
      rank: 5,
    },
    {
      id: "transparent-quote",
      name: "All-In Quote, No GST Surprises",
      painIntensity: 79,
      keywordVolume: 1100,
      differentiation: 58,
      rank: 6,
    },
    {
      id: "fast-clean",
      name: "One-Day Clean Install (WFH-friendly)",
      painIntensity: 71,
      keywordVolume: 920,
      differentiation: 51,
      rank: 7,
    },
  ],
  copyHooks: [
    {
      angleId: "monsoon-seal",
      stage: "problem",
      headline: "Putting towels under your window every monsoon? It's not normal.",
      openingLine:
        "Singapore HDB casement frames built before 2005 weren't sealed for the kind of horizontal rain we get now. The water track at the bottom is the giveaway — once it pools, mold follows in 3 weeks.",
    },
    {
      angleId: "aircon-bill",
      stage: "problem",
      headline: "Your aircon isn't broken. Your windows are leaking heat.",
      openingLine:
        "An afternoon-facing HDB unit with single-pane glass loses up to 38% of its cooling through the windows. Low-E glass cuts that to under 12% — your aircon runs less, your SP bill drops, your bedroom actually feels cool by 10pm.",
    },
    {
      angleId: "mrt-quiet",
      stage: "problem",
      headline: "If you can hear the 6am MRT, your windows are the cheapest fix.",
      openingLine:
        "We've measured 64dB inside HDB units along Thomson and East-West lines. Laminated double-glazing brings that to 38dB — about the difference between a busy hawker centre and a library reading room.",
    },
    {
      angleId: "hdb-easy",
      stage: "solution",
      headline: "We file the HDB permit. You file your fingernails.",
      openingLine:
        "HDB window replacement requires a BCA-licensed contractor and an approved permit application — paperwork that drags 6+ weeks if you DIY. We bundle it. You get a date, we get the stamp, the install happens.",
    },
    {
      angleId: "trust-warranty",
      stage: "solution",
      headline: "Read the warranty before you sign. Most can't.",
      openingLine:
        "A 'lifetime warranty' that voids if the contractor changes its UEN, or excludes 'rubber components' (which is what fails first in our humidity), is not a warranty — it's a marketing line. Ours covers the silicone seal and the gasket, in writing.",
    },
    {
      angleId: "transparent-quote",
      stage: "solution",
      headline: "S$420 per window — and we mean S$420 per window.",
      openingLine:
        "No 'site visit fee', no 'debris removal surcharge', no 'after-7pm hoist rate'. The quote includes GST, removal of old units, and the BCA paperwork. The only line that ever changes is if you upgrade glass.",
    },
    {
      angleId: "fast-clean",
      stage: "brand",
      headline: "Three windows, one day, zero days off work.",
      openingLine:
        "We dust-sheet your room before we touch the frame, install in under 4 hours per window, and vacuum on the way out. WFH parents and elderly residents stay in the unit — just close the bedroom door.",
    },
  ],
  testPlan: [
    {
      order: 1,
      angleName: "Monsoon Seal Guarantee",
      format: "Static carousel + UGC video (Meta + IG, geo-targeted by HDB town)",
      primaryCopy:
        "Slide 1: leaking window in heavy rain (UGC) | Slide 2: mold close-up | Slide 3: sealed-frame demo | Slide 4: 'Lifetime no-leak warranty'",
      cta: "Get a free monsoon-readiness check →",
      rationale: "Highest pain (92) + monsoon timing window. Best hook for older HDB stock in Bedok / Tampines / Woodlands.",
    },
    {
      order: 2,
      angleName: "Aircon Bill Killer (Low-E)",
      format: "30s explainer reel (TikTok + IG Reels), thermal-camera visual",
      primaryCopy:
        "Hook: 'Why your west-facing HDB feels like an oven by 4pm.' Show thermal scan of a single-pane vs Low-E window side-by-side, end with one-month SP bill comparison.",
      cta: "Calculate your aircon savings →",
      rationale: "Highest combined pain × keyword volume. Strong for west/north-west facing flats and condo afternoon-facing units.",
    },
    {
      order: 3,
      angleName: "HDB Permit, Done For You",
      format: "Long-form Meta lead-ad (8-paragraph body) + branded PDF lead magnet",
      primaryCopy:
        "Walks through the 5-step HDB window-replacement permit process and why DIY-ing it adds 6 weeks. Lead magnet: 'The HDB Window Permit Checklist (with the 3 fields most people fill in wrong).'",
      cta: "Send me the permit checklist →",
      rationale: "Captures the 21% ready-to-quote audience already shopping. High-intent, low-volume — best for retargeting the cold-traffic from #1 and #2.",
    },
  ],
};
