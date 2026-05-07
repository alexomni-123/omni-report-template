import type { Angle, PainPoint } from "@/lib/types";
import { Flame, Target, Users } from "lucide-react";

type Props = {
  pains: PainPoint[];
  angles: Angle[];
  realCount: number;
};

/**
 * Slack/email-shareable TL;DR card. Screenshot of this should be sufficient
 * to align the agency team in 30 seconds without reading the full report.
 */
export function ExecSummary({ pains, angles, realCount }: Props) {
  const topPains = [...pains]
    .filter((p) => p.intensity > 0)
    .sort((a, b) => {
      const aHot = a.sentiment?.avgNeg ?? 0;
      const bHot = b.sentiment?.avgNeg ?? 0;
      // Prioritize hot pains over chronic ones, then by intensity
      const aHotScore = aHot >= 1 ? 1 : 0;
      const bHotScore = bHot >= 1 ? 1 : 0;
      if (aHotScore !== bHotScore) return bHotScore - aHotScore;
      return b.intensity - a.intensity;
    })
    .slice(0, 3);

  const topAngles = [...angles].sort((a, b) => a.rank - b.rank).slice(0, 3);

  return (
    <section
      className="mb-10 report-card p-6 sm:p-8 border-2"
      style={{ borderColor: "color-mix(in oklab, var(--accent) 60%, transparent)" }}
    >
      <div className="flex items-baseline justify-between mb-5 gap-3 flex-wrap">
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
          🎯 Executive summary <span className="text-sm font-normal text-[color:var(--muted)]">(screenshot-ready)</span>
        </h2>
        <span className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--accent)]">
          {realCount > 0 ? `Grounded in ${realCount.toLocaleString()} real customer messages` : "Sample data"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Flame className="h-4 w-4 text-red-600 dark:text-red-400" />
            <p className="text-xs font-mono uppercase tracking-wide text-[color:var(--muted)]">
              Top 3 pains (hot first)
            </p>
          </div>
          <ol className="space-y-2 text-sm">
            {topPains.map((p, i) => (
              <li key={p.id} className="flex gap-2 leading-snug">
                <span className="font-mono text-[color:var(--muted)] shrink-0">{i + 1}.</span>
                <span>
                  <strong>{p.label}</strong>
                  {p.sentiment?.avgNeg !== undefined && p.sentiment.avgNeg >= 1 && (
                    <span className="ml-1.5 text-[10px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400">
                      hot
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-[color:var(--accent)]" />
            <p className="text-xs font-mono uppercase tracking-wide text-[color:var(--muted)]">
              Top 3 angles (corpus-ranked)
            </p>
          </div>
          <ol className="space-y-2 text-sm">
            {topAngles.map((a, i) => (
              <li key={a.id} className="flex gap-2 leading-snug">
                <span className="font-mono text-[color:var(--muted)] shrink-0">{i + 1}.</span>
                <span><strong>{a.name}</strong></span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-[color:var(--accent)]" />
            <p className="text-xs font-mono uppercase tracking-wide text-[color:var(--muted)]">
              This week
            </p>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2 leading-snug">
              <span className="font-mono text-[color:var(--muted)] shrink-0">·</span>
              <span><strong>Performance Analyst:</strong> validate gap thesis on Meta Ad Library</span>
            </li>
            <li className="flex gap-2 leading-snug">
              <span className="font-mono text-[color:var(--muted)] shrink-0">·</span>
              <span><strong>Senior Copywriter:</strong> 3 ad-copy variants from Reddit verbatim quotes</span>
            </li>
            <li className="flex gap-2 leading-snug">
              <span className="font-mono text-[color:var(--muted)] shrink-0">·</span>
              <span><strong>Media Buyer:</strong> $30/day Meta test, geo-targeted to older HDB towns</span>
            </li>
          </ul>
        </div>
      </div>

      <p className="mt-5 text-xs text-[color:var(--muted)] leading-snug border-t border-[color:var(--card-border)] pt-3">
        Full evidence + verbatim citations + competitor gap analysis in §3, §5, §9 below. See the data-quality table at the bottom for what's grounded vs synthesized vs illustrative.
      </p>
    </section>
  );
}
