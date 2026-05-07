import type { PainCluster } from "../cluster-pains";

/**
 * Vertical-specific stage classifier for skincare. Tunes the keyword
 * stage labels (problem / solution / brand) to skincare vocabulary.
 */
export const skincareSgStageMatchers = {
  problem:
    /\b(acne|pimple|breakout(ing)?|cystic|comedone|whitehead|blackhead|zit|sensitive|reactive|irritat|stinging|burning|allergic|itchy|rash|red|flush|sweat(y)?|humid(ity)?|oily|greasy|shiny|t[-\s]?zone|hyperpigmentation|melasma|dark\s*spot|sun\s*spot|scar(ring)?|pih|pie|uneven|patchy|blotchy|sunburn(t|ed)?|sun\s*damage|tan(ned)?|peeling|dry|dehydrated|stinging|tingl(e|ing)|burn(ed|ing|t)?|flare(d|up)?|rash|hate|hated|terrible|awful|nightmare|wasted|gave\s*up|cant\s*find|broke\s*out|broke\s*me\s*out|reaction|reacted)\b/i,
  brand:
    /\b(cerave|the\s*ordinary|drunk\s*elephant|paula'?s\s*choice|innisfree|laneige|cosrx|skin1004|beauty\s*of\s*joseon|biore|sunplay|skin\s*aqua|naturium|byoma|youth\s*to\s*the\s*people|sephora|watsons\s*review|review|reviews?|recommend(ed)?|best\s*(serum|moisturi[sz]er|cleanser|spf|sunscreen)|holy\s*grail|hg|dupe|alternative\s*to|compared\s*to)\b/i,
  solution:
    /\b(niacinamide|retinol|aha|bha|salicylic|hyaluronic|peptide|ceramide|panthenol|centella|cica|tranexamic|kojic|azelaic|adapalene|tretinoin|spf|sunscreen|moistur(i[sz]er|ising)|cleanser|toner|essence|serum|cream|gel|oil|sunscreen|low[\s-]?e|tinted|reapply|layering|routine|am\s*routine|pm\s*routine|patch\s*test)\b/i,
};

/**
 * SG / SEA-targeted skincare-vertical pain clusters. Tuned for DTC brands
 * selling cleansers / moisturizers / serums to 18–32yo customers in
 * Singapore + Malaysia + tropical climates (humidity, sweat, acne, sun
 * damage are dominant drivers).
 *
 * Source verticals to feed: r/SkincareAddictionAsia, r/AsianBeauty,
 * r/TheGirlSurvivalGuide, r/SgGirls, r/BeautySG, Carousell, beauty FB
 * groups. Different from windows: the corpus skews younger and is
 * majority female.
 */
export const skincareSgClusters: PainCluster[] = [
  {
    id: "acne",
    label: "Persistent acne / breakouts",
    matchers: [
      /\b(acne|pimple|breakout|cystic|comedone|whitehead|blackhead|zit)\b/i,
      /\b(spots?|bumps?)\s+(on|around)\s+(my|the)\s+(face|forehead|cheek|chin|jawline)\b/i,
      /\b(face|skin)\b.*\b(broke\s*out|breaking\s*out|flaring\s*up)\b/i,
    ],
  },
  {
    id: "sensitive",
    label: "Sensitive / reactive skin",
    matchers: [
      /\b(sensitive|reactive|irritat(ed|ing|ion)|stinging|burning)\s+skin\b/i,
      /\b(allergic\s+reaction|allergy|red\s+patch|flush|itchy|rash)\b/i,
      /\b(rosacea|eczema|dermatitis|seborrheic)\b/i,
    ],
  },
  {
    id: "humidity",
    label: "Tropical humidity / oily T-zone",
    matchers: [
      /\b(humid(ity)?|sweat(y|ing)?|tropical|sg\s*weather|hot\s+(and\s+)?humid)\b/i,
      /\b(oil(y|ier)?|greasy|shiny|t[-\s]?zone)\b/i,
      /\b(makeup\s+(melts|melting|sliding|slipping))\b/i,
    ],
  },
  {
    id: "pigmentation",
    label: "Dark spots / pigmentation / acne scars",
    matchers: [
      /\b(pigmentation|hyperpigmentation|melasma|dark\s+spot|sun\s+spot|scar(ring)?|pih|pie)\b/i,
      /\b(uneven|patchy|blotchy)\s+(skin|tone|complexion)\b/i,
    ],
  },
  {
    id: "sunburn",
    label: "Sun damage / SPF concerns",
    matchers: [
      /\b(sunburn(t|ed)?|sun\s+damage|uv|photoaging|tan(ned)?\s+too\s+much)\b/i,
      /\b(spf|sunscreen)\b.*\b(white\s+cast|sticky|greasy|patchy|reapply)\b/i,
    ],
  },
  {
    id: "ingredient-confusion",
    label: "Ingredient confusion / regimen anxiety",
    matchers: [
      /\b(don'?t\s+know\s+what\s+to\s+(use|buy|pick))\b/i,
      /\b(too\s+many\s+products|overwhelm(ed|ing))\b.*\b(skincare|routine)\b/i,
      /\b(retinol|niacinamide|aha|bha|salicylic|hyaluronic)\b.*\b(confus|scared|burn|reaction)\b/i,
      /\b(skincare\s+routine)\b.*\b(start|beginner|simple|basic)\b/i,
    ],
  },
  {
    id: "trust-greenwash",
    label: "Greenwashing / influencer-trust fatigue",
    matchers: [
      /\b(scam|fake\s+claim|not\s+work(ing)?|wasted\s+money|false\s+advertising)\b/i,
      /\b(influencer|tiktok|instagram)\b.*\b(misleading|paid|sponsored|exaggerat)\b/i,
      /\b(green[\s-]?wash|claims?\s+aren'?t\s+true|bullshit|cant\s+trust)\b/i,
    ],
  },
  {
    id: "cost",
    label: "Premium-skincare price fatigue",
    matchers: [
      /\b(expensive|overpriced|too\s+(much|costly)|cant\s+afford|budget|cheap(er)?\s+alternative|dupe)\b/i,
      /\b\$[\d]{2,3}\b.*\b(serum|cream|moisturi[sz]er|cleanser)\b/i,
    ],
  },
];
