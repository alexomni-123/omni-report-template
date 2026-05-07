"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { SectionShell } from "@/components/SectionShell";
import type { ICP } from "@/lib/types";

const PIE_COLORS = ["#fb923c", "#f97316", "#ea580c", "#c2410c"];
const HOUSE_COLORS = ["#fb923c", "#f59e0b", "#84cc16", "#06b6d4"];

type Props = { icp: ICP };

export function Section2ICP({ icp }: Props) {
  return (
    <SectionShell
      number={2}
      title="Inferred ICP"
      subtitle="Who the site copy is talking to — age, home type, and where they are in the buying journey."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <p className="text-xs font-mono uppercase tracking-wide text-[color:var(--muted)] mb-2">Age distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={icp.ageBuckets}
                dataKey="share"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={2}
              >
                {icp.ageBuckets.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <p className="text-xs font-mono uppercase tracking-wide text-[color:var(--muted)] mb-2">Home type</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={icp.homeTypes} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" hide domain={[0, 50]} />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 11 }} width={130} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="share" radius={[0, 4, 4, 0]}>
                {icp.homeTypes.map((_, i) => (
                  <Cell key={i} fill={HOUSE_COLORS[i % HOUSE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <p className="text-xs font-mono uppercase tracking-wide text-[color:var(--muted)] mb-2">Buying journey</p>
          <div className="space-y-3 mt-2">
            {icp.urgency.map((u, i) => (
              <div key={u.stage}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{u.stage}</span>
                  <span className="font-mono text-[color:var(--muted)]">{u.share}%</span>
                </div>
                <div className="h-2 rounded-full bg-[color:var(--card-border)] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${u.share}%`,
                      backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm leading-relaxed border-l-2 border-[color:var(--accent)] pl-4 italic text-[color:var(--foreground)]/80">
        {icp.oneLine}
      </p>
    </SectionShell>
  );
}
