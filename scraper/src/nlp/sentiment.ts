/**
 * Lexicon-based sentiment scoring. Crude but useful — catches the
 * difference between "the seal got weak" (chronic, intensity 1) and
 * "I gave up and just closed the window all the time" (frustration, 4)
 * or "newly reno-ed flat waterproofing leaking, contractor MIA" (anger, 5).
 *
 * Hot pains = recently-felt + emotionally-loaded. They convert better in
 * cold-traffic ads than chronic-but-tolerated pains.
 */

const NEGATIVE = new Set([
  // intensity 1 — mild gripe
  "annoying",
  "annoyed",
  "annoy",
  "irritating",
  "irritated",
  "irk",
  "bothered",
  "inconvenient",
  "inconvenience",
  "wrong",
  "issue",
  "problem",
  "trouble",
  // intensity 2 — frustration
  "frustrated",
  "frustrating",
  "frustration",
  "stuck",
  "broken",
  "leaking",
  "leak",
  "noisy",
  "loud",
  "stuffy",
  "stuffy",
  "drafty",
  "mouldy",
  "mouldy",
  "moldy",
  "mildew",
  "ugly",
  "useless",
  "worthless",
  "lousy",
  "expensive",
  "overpriced",
  "expired",
  // intensity 3 — strong negative
  "terrible",
  "awful",
  "horrible",
  "disgusting",
  "disgusted",
  "hated",
  "hate",
  "miserable",
  "suffer",
  "suffered",
  "suffering",
  "ridiculous",
  "stupid",
  "dumb",
  "garbage",
  "trash",
  // intensity 4 — anger
  "angry",
  "furious",
  "livid",
  "fucking",
  "fuck",
  "screwed",
  "screwed up",
  "gave up",
  "give up",
  "cant stand",
  "cannot stand",
  "lost",
  "wasted",
  "scam",
  "scammed",
  "cheated",
  "dishonest",
  "shady",
  // intensity 5 — desperation / panic
  "desperate",
  "nightmare",
  "disaster",
  "disastrous",
  "catastrophic",
  "ruined",
  "destroyed",
  "destroying",
  "mia",
  "disappeared",
  "vanished",
  "abandoned",
]);

const POSITIVE = new Set([
  "great",
  "excellent",
  "fantastic",
  "amazing",
  "love",
  "loved",
  "perfect",
  "happy",
  "satisfied",
  "recommend",
  "recommended",
  "professional",
  "quality",
  "smooth",
  "easy",
  "fast",
  "reliable",
  "trustworthy",
  "honest",
  "fair",
  "thank",
  "thanks",
  "appreciate",
]);

export function scoreSentiment(text: string): { neg: number; pos: number; net: number } {
  const tokens = text
    .toLowerCase()
    .replace(/[^\w\s']/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  let neg = 0;
  let pos = 0;
  for (const t of tokens) {
    if (NEGATIVE.has(t)) neg++;
    else if (POSITIVE.has(t)) pos++;
  }
  // Bigram check for "gave up" / "cant stand" / "screwed up" / "fast buck"
  for (let i = 0; i < tokens.length - 1; i++) {
    const bg = `${tokens[i]} ${tokens[i + 1]}`;
    if (NEGATIVE.has(bg)) neg++;
    if (bg === "fast buck") neg++;
    if (bg === "ripped off" || bg === "rip off") neg += 2;
    if (bg === "no choice" || bg === "no option") neg++;
  }
  return { neg, pos, net: neg - pos };
}
