import { SectionShell } from "@/components/SectionShell";
import { ListTodo, UserCircle, Clock } from "lucide-react";

type Action = {
  who: string;
  when: string;
  what: string;
  why: string;
  artifacts?: string;
};

const ACTIONS: Action[] = [
  {
    who: "Performance Analyst",
    when: "Day 1 (this week)",
    what: "Validate the gap thesis: cross-check Meta Ad Library for Home Aluminium, Ho Ho Door, Top 1 Window. Confirm none of them are running ads on seepage / noise / mould pain language.",
    why: "If a competitor IS already running a 'seepage' ad, our angle is no longer differentiated. If none are, the gap is real and our client wins by going first.",
    artifacts: "Screenshot of each competitor's Ad Library page; mark angles green/red.",
  },
  {
    who: "Senior Copywriter",
    when: "Day 1–2",
    what: "Draft 3 ad-copy variants for the top angle (Monsoon Seal Guarantee). Use the verbatim Reddit quotes in §3 as the hook source — not invented language.",
    why: "Copy that uses customer's own words tests better than copy written from a brief. The kitchen-floor / mouldy-bed / contractor-MIA quotes are ready-made hooks.",
    artifacts: "3× headline + opening line + 1 long-form. Each variant pinned to a specific Reddit citation URL.",
  },
  {
    who: "Video Editor",
    when: "Day 2–3",
    what: "Storyboard a 30s UGC-style reel for the Monsoon Seal angle: real photo of towels under window → kitchen-floor water trail → mould close-up → fixed casement → CTA.",
    why: "Highest-pain visual language we have evidence for. UGC outperforms studio production for trust-led pain angles.",
    artifacts: "Storyboard PDF + asset list + voiceover script.",
  },
  {
    who: "Media Buyer (Meta)",
    when: "Day 3",
    what: "Set up Meta campaign: $30/day budget, audience = SG, age 35–55, interest = HDB renovation + home improvement, geo-include Bedok / Tampines / Woodlands / Sengkang (older HDB stock concentration).",
    why: "Smallest spend that statistically separates winning creative from losing creative across 3 ad variants. Geo-targeting matches the renovation-trigger demographic from §1.",
    artifacts: "Meta Ads Manager campaign URL + audience save.",
  },
  {
    who: "Graphic Designer",
    when: "Day 2",
    what: "Build the 4-slide static carousel for §8 Test Plan #1: leak photo → mould close-up → sealed-frame demo → 'Lifetime no-leak warranty'.",
    why: "Static carousel is the cold-traffic workhorse. Sequential scroll = sequential pain → solution → proof.",
    artifacts: "4× 1080×1080 PNG + alt-text.",
  },
  {
    who: "Account Manager",
    when: "Day 4",
    what: "Client review meeting: present this report, walk through the gap analysis (§5), get client signoff on the top 3 angles before any spend.",
    why: "Avoid the most common agency failure mode — running ads the client doesn't believe in. Gap analysis is the most persuasive section; lead with it.",
    artifacts: "30-min walkthrough deck (this report → PDF) + signed creative brief.",
  },
];

export function Section9NextActions() {
  return (
    <SectionShell
      number={9}
      title="What to Do Tomorrow"
      subtitle="Translation layer — turning the report into team-assignable actions for the 15-person agency. Owner, deadline, deliverable, why."
    >
      <ol className="space-y-3">
        {ACTIONS.map((a, i) => (
          <li key={i} className="report-card p-4">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2 text-xs font-mono uppercase tracking-wide">
              <span className="flex items-center gap-1.5 text-[color:var(--accent)]">
                <UserCircle className="h-3.5 w-3.5" />
                {a.who}
              </span>
              <span className="flex items-center gap-1.5 text-[color:var(--muted)]">
                <Clock className="h-3.5 w-3.5" />
                {a.when}
              </span>
            </div>
            <p className="text-sm font-medium leading-snug mb-1">{a.what}</p>
            <p className="text-sm text-[color:var(--foreground)]/75 leading-snug">
              <span className="text-[color:var(--muted)] font-mono text-xs uppercase tracking-wide mr-1">why:</span>
              {a.why}
            </p>
            {a.artifacts && (
              <p className="text-xs text-[color:var(--muted)] mt-2 flex gap-1.5">
                <ListTodo className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>
                  <span className="font-mono uppercase tracking-wide">deliverable:</span> {a.artifacts}
                </span>
              </p>
            )}
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
