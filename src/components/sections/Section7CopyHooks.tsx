import { SectionShell } from "@/components/SectionShell";
import type { Angle, CopyHook } from "@/lib/types";
import { Quote } from "lucide-react";

const STAGE_LABEL: Record<string, string> = {
  problem: "Problem-aware",
  solution: "Solution-aware",
  brand: "Brand-aware",
};

const STAGE_COLOR: Record<string, string> = {
  problem: "#dc2626",
  solution: "#ea580c",
  brand: "#0ea5e9",
};

type Props = { hooks: CopyHook[]; angles: Angle[] };

export function Section7CopyHooks({ hooks, angles }: Props) {
  const angleById = new Map(angles.map((a) => [a.id, a]));
  const sorted = [...hooks].sort((a, b) => {
    const ar = angleById.get(a.angleId)?.rank ?? 99;
    const br = angleById.get(b.angleId)?.rank ?? 99;
    return ar - br;
  });

  return (
    <SectionShell
      number={7}
      title="Copy Hooks"
      subtitle="One headline + one opening line per angle, matched to awareness stage."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map((h) => {
          const angle = angleById.get(h.angleId);
          return (
            <div key={h.angleId} className="report-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono text-[color:var(--muted)]">
                  #{angle?.rank}
                </span>
                <span className="text-xs font-medium">{angle?.name}</span>
                <span
                  className="ml-auto text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full"
                  style={{ color: STAGE_COLOR[h.stage], backgroundColor: STAGE_COLOR[h.stage] + "1f" }}
                >
                  {STAGE_LABEL[h.stage]}
                </span>
              </div>
              <h3 className="text-base font-semibold leading-snug mb-2">
                {h.headline}
              </h3>
              <p className="text-sm leading-relaxed text-[color:var(--foreground)]/75">
                {h.openingLine}
              </p>
              {h.sources && h.sources.length > 0 && (
                <details className="mt-3 pt-3 border-t border-[color:var(--card-border)]/40">
                  <summary
                    className="cursor-pointer text-xs font-mono uppercase tracking-wide text-[color:var(--accent)] inline-flex items-center gap-1.5"
                  >
                    <Quote className="h-3 w-3" />
                    Grounded in {h.sources.length} verbatim source{h.sources.length === 1 ? "" : "s"}
                  </summary>
                  <ul className="mt-2 space-y-1.5 text-xs">
                    {h.sources.map((s, i) => (
                      <li key={i} className="leading-snug">
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener"
                          className="text-[color:var(--accent)] underline decoration-dotted underline-offset-2 mr-1"
                        >
                          ↗
                        </a>
                        <span className="italic text-[color:var(--foreground)]/75">&ldquo;{s.quote}&rdquo;</span>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
              {(!h.sources || h.sources.length === 0) && (
                <p className="mt-3 pt-3 border-t border-[color:var(--card-border)]/40 text-xs font-mono uppercase tracking-wide text-amber-600 dark:text-amber-500">
                  ⚠ No verbatim source — agency-drafted, validate before launch
                </p>
              )}
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
