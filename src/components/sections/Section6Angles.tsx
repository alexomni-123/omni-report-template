"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { SectionShell } from "@/components/SectionShell";
import type { Angle } from "@/lib/types";

type Props = { angles: Angle[] };

const SCATTER_COLORS = ["#dc2626", "#ea580c", "#f59e0b", "#84cc16", "#06b6d4", "#6366f1", "#a855f7"];

export function Section6Angles({ angles }: Props) {
  const sorted = [...angles].sort((a, b) => a.rank - b.rank);
  const top3 = sorted.slice(0, 3);

  const radarData = ["painIntensity", "keywordVolume", "differentiation"].map((axis) => {
    const row: Record<string, number | string> = { axis: axis === "painIntensity" ? "Pain" : axis === "keywordVolume" ? "Volume" : "Differentiation" };
    top3.forEach((a) => {
      const raw =
        axis === "painIntensity"
          ? a.painIntensity
          : axis === "keywordVolume"
          ? Math.min(100, (a.keywordVolume / 80))
          : a.differentiation;
      row[a.name] = raw;
    });
    return row;
  });

  return (
    <SectionShell
      number={6}
      title="Marketing Angles"
      subtitle="Ranked by (pain intensity × keyword volume × differentiation vs. competitors). 7 angles found, top 3 below in radar."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-mono uppercase tracking-wide text-[color:var(--muted)] mb-2">
            Pain × Volume map (bubble = differentiation)
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
              <XAxis
                type="number"
                dataKey="painIntensity"
                name="pain"
                domain={[40, 100]}
                tick={{ fontSize: 11 }}
                label={{ value: "Pain intensity →", position: "bottom", offset: -5, fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="keywordVolume"
                name="volume"
                tick={{ fontSize: 11 }}
                label={{ value: "Mo. volume", angle: -90, position: "insideLeft", fontSize: 11 }}
              />
              <ZAxis type="number" dataKey="differentiation" range={[80, 600]} name="diff" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) => [v, name]}
                labelFormatter={(_, p) => {
                  if (!p || p.length === 0) return "";
                  const a = p[0].payload as Angle;
                  return `${a.name}  (rank #${a.rank})`;
                }}
              />
              <Scatter data={sorted}>
                {sorted.map((a, i) => (
                  <Cell key={a.id} fill={SCATTER_COLORS[i % SCATTER_COLORS.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div>
          <p className="text-xs font-mono uppercase tracking-wide text-[color:var(--muted)] mb-2">
            Top 3 angles — shape comparison
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData} outerRadius={110}>
              <PolarGrid stroke="var(--card-border)" />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis tick={{ fontSize: 9 }} domain={[0, 100]} />
              {top3.map((a, i) => (
                <Radar
                  key={a.id}
                  name={a.name}
                  dataKey={a.name}
                  stroke={SCATTER_COLORS[i]}
                  fill={SCATTER_COLORS[i]}
                  fillOpacity={0.18}
                />
              ))}
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 -mx-2 sm:mx-0 overflow-x-auto">
      <table className="w-full text-sm min-w-[440px]">
        <thead>
          <tr className="text-xs font-mono uppercase tracking-wide text-[color:var(--muted)] border-b border-[color:var(--card-border)]">
            <th className="text-left py-2 w-10">#</th>
            <th className="text-left py-2">Angle</th>
            <th className="text-right py-2 px-2">Pain</th>
            <th className="text-right py-2 px-2">Mo. vol.</th>
            <th className="text-right py-2 px-2">Diff.</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((a, i) => (
            <tr key={a.id} className="border-b border-[color:var(--card-border)]/40">
              <td className="py-2 font-mono text-[color:var(--muted)]">{a.rank}</td>
              <td className="py-2 font-medium" style={{ color: i < 3 ? SCATTER_COLORS[i] : undefined }}>
                {a.name}
              </td>
              <td className="text-right py-2 px-2 font-mono">{a.painIntensity}</td>
              <td className="text-right py-2 px-2 font-mono">{a.keywordVolume.toLocaleString()}</td>
              <td className="text-right py-2 px-2 font-mono">{a.differentiation}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </SectionShell>
  );
}
