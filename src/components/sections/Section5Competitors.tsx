import { SectionShell } from "@/components/SectionShell";
import type { Competitor } from "@/lib/types";
import { Quote, Gift, ShieldCheck, AlertTriangle } from "lucide-react";

type Props = {
  competitors: Competitor[];
  gap?: {
    whatTheyAllSay: string[];
    whatCustomersActuallySay: string[];
    theGap: string;
  };
};

export function Section5Competitors({ competitors, gap }: Props) {
  return (
    <SectionShell
      number={5}
      title="Competitor Angle Teardown"
      subtitle="Top 3 SG SERP rivals (real businesses, hero/offer/proof extracted from their live homepages on 2026-05-07)."
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

      {gap && (
        <div className="mt-8 report-card p-5 border-[color:var(--accent)]/30">
          <div className="flex items-baseline gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-[color:var(--accent)]" />
            <h3 className="text-sm font-semibold tracking-tight">Gap analysis — where to win</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-mono uppercase tracking-wide text-[color:var(--muted)] mb-2">What they all say</p>
              <ul className="space-y-1">
                {gap.whatTheyAllSay.map((s, i) => (
                  <li key={i} className="text-[color:var(--foreground)]/80 leading-snug">
                    <span className="text-[color:var(--muted)] font-mono mr-1">·</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wide text-[color:var(--muted)] mb-2">What customers actually say</p>
              <ul className="space-y-1">
                {gap.whatCustomersActuallySay.map((s, i) => (
                  <li key={i} className="italic text-[color:var(--foreground)]/85 leading-snug">
                    &ldquo;{s}&rdquo;
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed border-l-2 border-[color:var(--accent)] pl-4 text-[color:var(--foreground)]/90">
            {gap.theGap}
          </p>
        </div>
      )}
    </SectionShell>
  );
}
