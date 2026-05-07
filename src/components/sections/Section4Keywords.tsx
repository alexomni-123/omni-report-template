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
import type { Keyword } from "@/lib/types";

const STAGE_COLORS: Record<string, string> = {
  problem: "#dc2626",
  solution: "#ea580c",
  brand: "#0ea5e9",
};

const STAGE_LABEL: Record<string, string> = {
  problem: "Problem-aware",
  solution: "Solution-aware",
  brand: "Brand-aware",
};

type Props = {
  keywords: Keyword[];
  googleSuggest?: { seed: string; suggestions: string[] }[];
};

export function Section4Keywords({ keywords, googleSuggest }: Props) {
  const grouped = (["problem", "solution", "brand"] as const).map((stage) => {
    const list = keywords.filter((k) => k.stage === stage);
    return {
      stage,
      label: STAGE_LABEL[stage],
      total: list.reduce((s, k) => s + k.monthlyVolume, 0),
      count: list.length,
    };
  });

  const top = [...keywords].sort((a, b) => b.monthlyVolume - a.monthlyVolume).slice(0, 10);

  return (
    <SectionShell
      number={4}
      title="Keyword Phrases"
      subtitle="Bucketed by buyer awareness stage. Sources: keywordtool.io, Google autocomplete, People Also Ask."
    >
      <div className="grid grid-cols-3 gap-4 mb-8">
        {grouped.map((g) => (
          <div key={g.stage} className="report-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STAGE_COLORS[g.stage] }} />
              <p className="text-xs font-mono uppercase tracking-wide text-[color:var(--muted)]">{g.label}</p>
            </div>
            <p className="text-2xl font-semibold">{g.total.toLocaleString()}</p>
            <p className="text-xs text-[color:var(--muted)] mt-1">
              total mo. volume · {g.count} phrases
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-mono uppercase tracking-wide text-[color:var(--muted)]">
          Top phrases by monthly search volume
        </p>
        <div className="flex gap-3 text-[11px]">
          {Object.entries(STAGE_LABEL).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: STAGE_COLORS[k] }} />
              <span className="text-[color:var(--muted)]">{v}</span>
            </span>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={Math.max(280, top.length * 32)}>
        <BarChart data={top} layout="vertical" margin={{ left: 10, right: 30 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="phrase"
            tick={{ fontSize: 11 }}
            width={240}
          />
          <Tooltip formatter={(v) => Number(v).toLocaleString()} />
          <Bar dataKey="monthlyVolume" radius={[0, 4, 4, 0]}>
            {top.map((k) => (
              <Cell key={k.phrase} fill={STAGE_COLORS[k.stage]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {googleSuggest && googleSuggest.length > 0 && (() => {
        const flat = [...new Set(googleSuggest.flatMap((g) => g.suggestions))]
          .filter((s) => /\b(window|casement|sliding|aircon|aluminum|aluminium|seepage|leak|noise|sound|hdb|condensation|mou?ld|grille|low\s*e|glass|frame|sealant|silicone)\b/i.test(s))
          .slice(0, 24);
        if (flat.length === 0) return null;
        return (
          <div className="mt-8 report-card p-5">
            <p className="text-xs font-mono uppercase tracking-wide text-[color:var(--muted)] mb-3">
              Google Search completions (live SG search behavior, fetched via suggestqueries.google.com)
            </p>
            <div className="flex flex-wrap gap-1.5">
              {flat.map((s) => (
                <span
                  key={s}
                  className="text-xs font-mono px-2 py-1 rounded-md bg-[color:var(--accent-soft)] text-[color:var(--foreground)]/85 border border-[color:var(--accent)]/20"
                >
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-[color:var(--muted)]">
              These are the actual Google Suggest completions Singaporeans receive when typing the seed phrases into Google — real Google-ranked search demand, not citation counts.
            </p>
          </div>
        );
      })()}
    </SectionShell>
  );
}
