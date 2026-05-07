import type { Snapshot } from "@/lib/types";

type Props = {
  generatedAt: string;
  generatedBy: string;
  snapshot: Snapshot;
};

export function ReportHeader({ generatedAt, generatedBy, snapshot }: Props) {
  return (
    <header className="mb-10 border-b border-[color:var(--card-border)] pb-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-[color:var(--accent)]">
            Marketing Angle Report
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">
            {snapshot.vertical}
          </h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            {snapshot.serviceArea} · <a href={snapshot.websiteUrl} className="underline decoration-dotted underline-offset-4">{snapshot.websiteUrl}</a>
          </p>
        </div>
        <div className="text-right text-xs text-[color:var(--muted)] font-mono">
          <p>Generated {generatedAt}</p>
          <p className="mt-1">[Generated with {generatedBy}]</p>
        </div>
      </div>
    </header>
  );
}
