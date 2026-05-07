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
import { Flame, Snowflake, Newspaper } from "lucide-react";

type PressItem = { headline: string; outlet: string; date?: string; url: string; takeaway: string };
type Props = { painPoints: PainPoint[]; press?: PressItem[] };

function temperatureBadge(avgNeg?: number) {
  if (avgNeg === undefined || avgNeg === null) return null;
  if (avgNeg >= 1.0)
    return {
      label: "Hot",
      Icon: Flame,
      className: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-300/40",
      tooltip: `avg ${avgNeg.toFixed(2)} neg-words/comment — visceral, recently-felt`,
    };
  if (avgNeg >= 0.5)
    return {
      label: "Warm",
      Icon: Flame,
      className: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-500 border-amber-300/40",
      tooltip: `avg ${avgNeg.toFixed(2)} neg-words/comment`,
    };
  return {
    label: "Chronic",
    Icon: Snowflake,
    className: "bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 border-sky-300/40",
    tooltip: `avg ${avgNeg.toFixed(2)} neg-words/comment — talked about often, but customers have resigned to it`,
  };
}

function intensityColor(v: number) {
  if (v >= 85) return "#dc2626";
  if (v >= 70) return "#ea580c";
  if (v >= 55) return "#f59e0b";
  return "#84cc16";
}

export function Section3PainPoints({ painPoints, press }: Props) {
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

      <div className="mt-6 -mx-2 sm:mx-0 overflow-x-auto">
      <table className="w-full text-sm min-w-[420px]">
        <thead>
          <tr className="text-xs font-mono uppercase tracking-wide text-[color:var(--muted)] border-b border-[color:var(--card-border)]">
            <th className="text-left py-2 px-2">Pain</th>
            <th className="text-left py-2 px-2">Temp</th>
            <th className="text-right py-2 px-2">Client</th>
            <th className="text-right py-2 px-2">Reviews</th>
            <th className="text-right py-2 px-2">Reddit</th>
            <th className="text-right py-2 px-2">Forums</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => {
            const t = temperatureBadge(p.sentiment?.avgNeg);
            return (
              <tr key={p.id} className="border-b border-[color:var(--card-border)]/40">
                <td className="py-2">{p.label}</td>
                <td className="py-2 px-2">
                  {t && (
                    <span
                      title={t.tooltip}
                      className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded-full border ${t.className}`}
                    >
                      <t.Icon className="h-3 w-3" />
                      {t.label}
                    </span>
                  )}
                </td>
                <td className="text-right py-2 px-2 font-mono">{p.sources.client}</td>
                <td className="text-right py-2 px-2 font-mono">{p.sources.reviews}</td>
                <td className="text-right py-2 px-2 font-mono">{p.sources.reddit}</td>
                <td className="text-right py-2 px-2 font-mono">{p.sources.forums}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>

      <p className="text-xs text-[color:var(--muted)] mt-3 leading-snug">
        <strong className="text-[color:var(--foreground)]">Strategic note:</strong> "Hot" pains (avg ≥ 1.0 neg-words/comment) outperform "Chronic" pains in cold-traffic ads.
        Heat-related complaints are <em>frequent</em> on Reddit but customers have resigned to it (low neg-word density). Seepage and contractor-trust pains are
        <em> hotter</em> — they still anger customers — and convert better.
      </p>

      {press && press.length > 0 && (
        <div className="mt-8 report-card p-4 border-l-4" style={{ borderLeftColor: "var(--accent)" }}>
          <div className="flex items-baseline gap-2 mb-3">
            <Newspaper className="h-4 w-4 text-[color:var(--accent)]" />
            <h3 className="text-sm font-semibold tracking-tight">Published press &amp; policy context</h3>
          </div>
          <ul className="space-y-3">
            {press.map((p, i) => (
              <li key={i} className="text-sm">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener"
                  className="font-medium leading-snug text-[color:var(--accent)] underline decoration-dotted underline-offset-4"
                >
                  &ldquo;{p.headline}&rdquo;
                </a>
                <span className="text-[color:var(--muted)] font-mono text-[11px] uppercase tracking-wide ml-2">
                  {p.outlet}{p.date ? ` · ${p.date}` : ""}
                </span>
                <p className="mt-1 leading-snug text-[color:var(--foreground)]/80">
                  <span className="text-[color:var(--muted)] font-mono text-[10px] uppercase tracking-wide mr-1">takeaway:</span>
                  {p.takeaway}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

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
