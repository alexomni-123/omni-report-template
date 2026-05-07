"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { SectionShell } from "@/components/SectionShell";
import type { PainPoint } from "@/lib/types";

type Props = { painPoints: PainPoint[] };

function intensityColor(v: number) {
  if (v >= 85) return "#dc2626";
  if (v >= 70) return "#ea580c";
  if (v >= 55) return "#f59e0b";
  return "#84cc16";
}

export function Section3PainPoints({ painPoints }: Props) {
  const sorted = [...painPoints].sort((a, b) => b.intensity - a.intensity);

  return (
    <SectionShell
      number={3}
      title="Pain Points"
      subtitle="Sourced from client-site copy, Google/Yelp reviews, Reddit + Quora threads, and trade forums. Ranked by intensity (0–100)."
    >
      <ResponsiveContainer width="100%" height={Math.max(280, sorted.length * 36)}>
        <BarChart data={sorted} layout="vertical" margin={{ left: 10, right: 30 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 12 }}
            width={210}
          />
          <Tooltip
            formatter={(v, _name, p) => {
              const pp = p.payload as PainPoint;
              const total = pp.sources.client + pp.sources.reviews + pp.sources.reddit + pp.sources.forums;
              return [`intensity ${v} · ${total} citations`, ""];
            }}
          />
          <Bar dataKey="intensity" radius={[0, 4, 4, 0]}>
            {sorted.map((p) => (
              <Cell key={p.id} fill={intensityColor(p.intensity)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <table className="w-full mt-6 text-sm">
        <thead>
          <tr className="text-xs font-mono uppercase tracking-wide text-[color:var(--muted)] border-b border-[color:var(--card-border)]">
            <th className="text-left py-2">Pain</th>
            <th className="text-right py-2 px-2">Client site</th>
            <th className="text-right py-2 px-2">Reviews</th>
            <th className="text-right py-2 px-2">Reddit</th>
            <th className="text-right py-2 px-2">Forums</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => (
            <tr key={p.id} className="border-b border-[color:var(--card-border)]/40">
              <td className="py-2">{p.label}</td>
              <td className="text-right py-2 px-2 font-mono">{p.sources.client}</td>
              <td className="text-right py-2 px-2 font-mono">{p.sources.reviews}</td>
              <td className="text-right py-2 px-2 font-mono">{p.sources.reddit}</td>
              <td className="text-right py-2 px-2 font-mono">{p.sources.forums}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {sorted.some((p) => (p.evidence?.length ?? 0) > 0) && (
        <div className="mt-8 space-y-4">
          <p className="text-xs font-mono uppercase tracking-wide text-[color:var(--muted)]">
            Verbatim customer evidence
          </p>
          {sorted
            .filter((p) => (p.evidence?.length ?? 0) > 0)
            .map((p) => (
              <div key={p.id} className="report-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: intensityColor(p.intensity) }}
                  />
                  <p className="text-sm font-medium">{p.label}</p>
                </div>
                <ul className="space-y-3">
                  {p.evidence?.map((e, i) => (
                    <li key={i} className="border-l-2 border-[color:var(--accent)]/40 pl-3">
                      <p className="text-sm italic leading-snug text-[color:var(--foreground)]/85">
                        &ldquo;{e.quote}&rdquo;
                      </p>
                      <p className="text-[11px] font-mono text-[color:var(--muted)] mt-1">
                        <a
                          href={e.url}
                          target="_blank"
                          rel="noopener"
                          className="text-[color:var(--accent)] underline decoration-dotted underline-offset-2 mr-1"
                        >
                          ↗
                        </a>
                        {e.thread}
                      </p>
                    </li>
                  ))}
                </ul>
                {(p.topPhrases?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[color:var(--card-border)]/40">
                    {p.topPhrases?.slice(0, 6).map((ph) => (
                      <span
                        key={ph.text}
                        className="text-xs px-2 py-0.5 rounded-full bg-[color:var(--accent-soft)] text-[color:var(--foreground)]/80"
                      >
                        &ldquo;{ph.text}&rdquo;{" "}
                        <span className="font-mono text-[color:var(--muted)]">×{ph.count}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </SectionShell>
  );
}
