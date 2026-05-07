import { SectionShell } from "@/components/SectionShell";
import type { TestPlanCreative } from "@/lib/types";
import { Sparkles, Target, Lightbulb, BarChart3 } from "lucide-react";

type Benchmarks = {
  goodCPL: string;
  badCPL: string;
  cpmGuardrail: string;
  ctrTarget: string;
  exampleEcon: string;
  source: string;
};

type Props = { plan: TestPlanCreative[]; benchmarks?: Benchmarks };

export function Section8TestPlan({ plan, benchmarks }: Props) {
  return (
    <SectionShell
      number={8}
      title="Test Plan"
      subtitle="The first 3 ad creatives to launch — chosen to cover the awareness funnel from cold-traffic to ready-to-quote."
    >
      {benchmarks && (
        <div className="report-card p-4 mb-5 border-l-4" style={{ borderLeftColor: "var(--accent)" }}>
          <div className="flex items-baseline gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-[color:var(--accent)]" />
            <h3 className="text-sm font-semibold tracking-tight">SG Meta benchmark guardrails</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wide text-[color:var(--muted)]">Good CPL</p>
              <p className="font-medium">{benchmarks.goodCPL}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wide text-[color:var(--muted)]">Kill creative if</p>
              <p className="font-medium text-red-600 dark:text-red-400">{benchmarks.badCPL}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wide text-[color:var(--muted)]">CPM guardrail</p>
              <p className="font-medium">{benchmarks.cpmGuardrail}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wide text-[color:var(--muted)]">CTR target</p>
              <p className="font-medium">{benchmarks.ctrTarget}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[10px] font-mono uppercase tracking-wide text-[color:var(--muted)]">Working example</p>
              <p className="font-medium">{benchmarks.exampleEcon}</p>
            </div>
          </div>
          <p className="mt-3 text-[11px] font-mono text-[color:var(--muted)]">Source: {benchmarks.source}</p>
        </div>
      )}

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
