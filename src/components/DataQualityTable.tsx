import { CheckCircle2, Cpu, AlertCircle } from "lucide-react";

type Grade = "real" | "synthesized" | "illustrative";

const GRADES: { section: string; grade: Grade; basis: string }[] = [
  {
    section: "1. Snapshot",
    grade: "real",
    basis: "HDB.gov.sg + EdgeProp + PropertyGuru SG (1.13M HDB flats, 13,480 MOP'ing in 2026, real S$400–900/window range)",
  },
  {
    section: "2. ICP demographics",
    grade: "illustrative",
    basis: "Age/home-type splits are estimates. ICP one-liner is real (corpus-grounded). v2 should triangulate from Singstat census + Meta Ads Library audiences.",
  },
  {
    section: "3. Pain Points",
    grade: "real",
    basis: "8 clusters scored on 1,452 on-topic comments from r/singapore + r/HDB + r/askSingapore. Verbatim quotes attributed to source threads.",
  },
  {
    section: "4. Keyword phrases",
    grade: "synthesized",
    basis: "Phrases real (extracted from corpus); 'monthlyVolume' is mention-count, not Google search volume. v2 should hook Google Trends API for real SG volumes.",
  },
  {
    section: "5. Competitor teardown",
    grade: "real",
    basis: "Hero/offer/proof for Home Aluminium, Ho Ho Door, Top 1 Window — extracted from their live homepages on 2026-05-07. Gap analysis grounded in corpus.",
  },
  {
    section: "6. Marketing angles",
    grade: "synthesized",
    basis: "Re-ranked by Claude reading 1,452 comments. PainIntensity from §3; KeywordVolume / Differentiation are model estimates pending §4 Google Trends fix.",
  },
  {
    section: "7. Copy hooks",
    grade: "synthesized",
    basis: "Each hook anchored on a verbatim Reddit quote. Headlines drafted by Claude — should be human-edited and tested via §8 plan before client delivery.",
  },
  {
    section: "8. Test plan",
    grade: "synthesized",
    basis: "Format / budget / audience drafted from corpus signal. Final media-buy parameters should be set by the agency's Performance Analyst.",
  },
  {
    section: "9. Next actions",
    grade: "illustrative",
    basis: "Template — replace with the agency's actual team roster + capacity.",
  },
];

const STYLE: Record<Grade, { label: string; color: string; bg: string; Icon: React.ComponentType<{ className?: string }> }> = {
  real: { label: "Real", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", Icon: CheckCircle2 },
  synthesized: { label: "LLM synthesis", color: "text-sky-700 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-900/20", Icon: Cpu },
  illustrative: { label: "Illustrative", color: "text-amber-700 dark:text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20", Icon: AlertCircle },
};

export function DataQualityTable() {
  return (
    <div className="report-card p-5 mb-8">
      <p className="text-xs font-mono uppercase tracking-widest text-[color:var(--muted)] mb-3">
        Data quality by section
      </p>
      <table className="w-full text-sm">
        <tbody>
          {GRADES.map((g) => {
            const s = STYLE[g.grade];
            const I = s.Icon;
            return (
              <tr key={g.section} className="border-b border-[color:var(--card-border)]/40 last:border-0">
                <td className="py-2 pr-3 font-medium whitespace-nowrap align-top">{g.section}</td>
                <td className="py-2 pr-3 align-top">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full ${s.bg} ${s.color}`}>
                    <I className="h-3 w-3" />
                    {s.label}
                  </span>
                </td>
                <td className="py-2 text-[color:var(--foreground)]/75 leading-snug">{g.basis}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
