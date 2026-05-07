import { SectionShell } from "@/components/SectionShell";
import type { Competitor } from "@/lib/types";
import { Quote, Gift, ShieldCheck } from "lucide-react";

type Props = { competitors: Competitor[] };

export function Section5Competitors({ competitors }: Props) {
  return (
    <SectionShell
      number={5}
      title="Competitor Angle Teardown"
      subtitle="Top 3 SERP rivals. What's their hook, what's the offer, what's the proof element?"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {competitors.map((c) => (
          <div key={c.name} className="report-card p-5 flex flex-col">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="font-semibold text-base">{c.name}</h3>
              <a
                href={c.url}
                className="text-xs font-mono text-[color:var(--accent)] underline decoration-dotted underline-offset-4"
              >
                visit ↗
              </a>
            </div>

            <div className="space-y-3 text-sm flex-1">
              <div className="flex gap-2">
                <Quote className="h-4 w-4 mt-0.5 text-[color:var(--accent)] shrink-0" />
                <p className="leading-snug">&ldquo;{c.heroHook}&rdquo;</p>
              </div>
              <div className="flex gap-2">
                <Gift className="h-4 w-4 mt-0.5 text-[color:var(--muted)] shrink-0" />
                <p className="leading-snug text-[color:var(--foreground)]/80">{c.offer}</p>
              </div>
              <div className="flex gap-2">
                <ShieldCheck className="h-4 w-4 mt-0.5 text-[color:var(--muted)] shrink-0" />
                <p className="leading-snug text-[color:var(--foreground)]/80">{c.proof}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
