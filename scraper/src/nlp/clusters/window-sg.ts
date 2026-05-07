import type { PainCluster } from "../cluster-pains";

/**
 * SG window-vertical pain clusters. Each cluster is matched with a regex over comment text.
 * Tune these per-client; the names match the Report.painPoints labels in /src/data/sample.ts.
 */
export const windowSgClusters: PainCluster[] = [
  {
    id: "noise",
    label: "MRT / road / aircon-compressor noise",
    matchers: [
      /\b(mrt|road|traffic|construction|aircon\s*compressor|noisy|noise|loud|sleep)\b.*\b(window|bedroom)\b/i,
      /\b(window|bedroom)\b.*\b(mrt|noise|loud|noisy|traffic|construction|sleep)\b/i,
      /sound[\s-]?proof|soundproof|laminat(e|ed)\s*glass/i,
    ],
  },
  {
    id: "heat",
    label: "Heat gain / soaring aircon bills",
    matchers: [
      // Require explicit aircon/cooling/heating-bill terms (no bare "hot" — that hits noise like "hot and pretty")
      /\b(aircon|air[\s-]?con|aircond?ition\w*)\b/i,
      /\b(electricity|sp|utility|utilities)\s*bill\b/i,
      /\b(west[\s-]?facing|afternoon\s*sun|sun[\s-]?facing|heat\s*(gain|trap|build[\s-]?up))\b/i,
      /\bhot\b.*\b(window|room|bedroom|flat|unit|hdb|condo|aircon|sun)\b/i,
      /\b(window|room|bedroom|flat|unit|hdb|condo|aircon|sun)\b.*\bhot\b/i,
      /low[\s-]?e\s*glass|tinted?\s*window|solar\s*film|window\s*tint/i,
    ],
  },
  {
    id: "seepage",
    label: "Monsoon water seepage at frame / sill",
    matchers: [
      /\bseepage|leak(?:ing|ed|s)?|water\b.*\b(rain|monsoon|window|frame|sill)\b/i,
      /\b(rain|monsoon|storm)\b.*\b(window|frame|sill|leak)\b/i,
      /silicone|sealant|caulk(?:ing)?/i,
    ],
  },
  {
    id: "mold",
    label: "Humidity + mold around frames",
    matchers: [
      /\bmou?ld(y|ing)?|mildew|condensation|humid(?:ity)?|damp\b.*\b(window|frame)\b/i,
      /\b(window|frame)\b.*\b(mou?ld|mildew|condensation|humid|damp|black\s*ring|stain)\b/i,
    ],
  },
  {
    id: "hdb-approval",
    label: "HDB approval / BCA paperwork anxiety",
    matchers: [
      /\bhdb\s*(permit|approval|application|form|submission|process)\b/i,
      /bca[\s-]?(license|licensed|approved|registered|certified|cert)/i,
      /\bpermit\b.*\bwindow\b/i,
      /\brebars?\b|\bgrille\b.*\bhdb\b/i,
    ],
  },
  {
    id: "trust",
    label: "Contractor trust / vanishing-warranty fear",
    matchers: [
      /\b(scam|cheat|run\s*away|disappear|ghost(ed)?|never\s*came\s*back|won\'?t\s*honor|warranty\s*void|cmi)\b/i,
      /\b(warranty|guarantee)\b.*\b(void|expire|change|useless|short)\b/i,
      /\b(uen|company\s*close[ds]?|wind[\s-]?up|liquidat)/i,
    ],
  },
  {
    id: "disruption",
    label: "Mess + disruption (kids, elderly, WFH)",
    matchers: [
      /\b(mess(y)?|dust|debris|noisy\s*install|whole\s*day|days?\s*off)\b/i,
      /\b(wfh|work[\s-]?from[\s-]?home|baby|toddler|elderly|grandma|grandpa)\b.*\b(install|window|reno)\b/i,
    ],
  },
  {
    id: "cost",
    label: "Hidden cost / opaque quotes (debris, hoist, GST)",
    matchers: [
      /\b(hidden\s*(cost|fee|charge)|surcharge|quote(?:d)?\s*(extra|more|surprise))\b/i,
      /\b(gst|debris\s*removal|hoist|after[\s-]?hours?\s*(fee|rate)|disposal\s*fee)\b/i,
      /\bquote\b.*\b(low(?:ball|er)?|cheap|hidden|extra)\b/i,
    ],
  },
];
