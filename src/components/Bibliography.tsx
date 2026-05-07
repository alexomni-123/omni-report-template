type Source = { kind: string; url: string; label: string };

type Props = {
  pressContext?: { url: string; headline: string; outlet: string }[];
  competitors?: { name: string; url: string }[];
  evidence?: { url: string; thread: string }[];
  copyHookSources?: { url: string; quote: string }[];
};

/**
 * Bibliography of every external URL that contributed to the report.
 * Trust signal — agency client (or auditor) can verify every claim
 * traces to a real source.
 */
export function Bibliography({ pressContext, competitors, evidence, copyHookSources }: Props) {
  const sources: Source[] = [];

  // Press / news / policy
  pressContext?.forEach((p) => {
    if (sources.some((s) => s.url === p.url)) return;
    sources.push({ kind: "Press", url: p.url, label: `${p.outlet} — ${p.headline}` });
  });

  // Competitors
  competitors?.forEach((c) => {
    if (sources.some((s) => s.url === c.url)) return;
    sources.push({ kind: "Competitor", url: c.url, label: c.name });
  });

  // Reddit / forum citations from pain evidence
  evidence?.forEach((e) => {
    if (sources.some((s) => s.url === e.url)) return;
    sources.push({ kind: "Citation", url: e.url, label: e.thread });
  });

  // Copy-hook sources (deduped)
  copyHookSources?.forEach((s) => {
    if (sources.some((x) => x.url === s.url)) return;
    sources.push({ kind: "Copy-hook source", url: s.url, label: s.quote.slice(0, 90) + (s.quote.length > 90 ? "…" : "") });
  });

  if (sources.length === 0) return null;

  // Group by kind for cleaner reading
  const groups = sources.reduce<Record<string, Source[]>>((acc, s) => {
    (acc[s.kind] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="report-card p-5 mt-8">
      <p className="text-xs font-mono uppercase tracking-widest text-[color:var(--muted)] mb-3">
        Bibliography — every source URL that contributed to this report ({sources.length})
      </p>
      {Object.entries(groups).map(([kind, list]) => (
        <div key={kind} className="mb-4 last:mb-0">
          <p className="text-[11px] font-mono uppercase tracking-wide text-[color:var(--accent)] mb-2">
            {kind} ({list.length})
          </p>
          <ul className="space-y-1.5 text-sm">
            {list.map((s) => (
              <li key={s.url} className="flex gap-2 leading-snug">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener"
                  className="text-[color:var(--accent)] underline decoration-dotted underline-offset-2 shrink-0"
                >
                  ↗
                </a>
                <span className="text-[color:var(--foreground)]/85 break-words min-w-0">
                  {s.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
