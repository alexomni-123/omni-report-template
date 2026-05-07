import { SectionShell } from "@/components/SectionShell";
import type { TestPlanCreative } from "@/lib/types";
import { Sparkles, Target, Lightbulb } from "lucide-react";

type Props = { plan: TestPlanCreative[] };

export function Section8TestPlan({ plan }: Props) {
  return (
    <SectionShell
      number={8}
      title="Test Plan"
      subtitle="The first 3 ad creatives to launch — chosen to cover the awareness funnel from cold-traffic to ready-to-quote."
    >
      <ol className="space-y-4">
        {plan.map((c) => (
          <li key={c.order} className="report-card p-5">
            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-mono text-2xl font-bold text-[color:var(--accent)]">
                {String(c.order).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-semibold text-base">{c.angleName}</h3>
                <p className="text-xs text-[color:var(--muted)] font-mono uppercase tracking-wide mt-0.5">
                  {c.format}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-[color:var(--accent)] shrink-0" />
                <div>
                  <p className="text-xs font-mono uppercase tracking-wide text-[color:var(--muted)] mb-1">Primary copy</p>
                  <p className="leading-snug">{c.primaryCopy}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Target className="h-4 w-4 mt-0.5 text-[color:var(--accent)] shrink-0" />
                <div>
                  <p className="text-xs font-mono uppercase tracking-wide text-[color:var(--muted)] mb-1">CTA</p>
                  <p className="leading-snug font-medium">{c.cta}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Lightbulb className="h-4 w-4 mt-0.5 text-[color:var(--accent)] shrink-0" />
                <div>
                  <p className="text-xs font-mono uppercase tracking-wide text-[color:var(--muted)] mb-1">Why first</p>
                  <p className="leading-snug text-[color:var(--foreground)]/75">{c.rationale}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
