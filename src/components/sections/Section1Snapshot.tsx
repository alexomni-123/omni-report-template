import { SectionShell } from "@/components/SectionShell";
import type { Snapshot } from "@/lib/types";
import { Building2, MapPin, Briefcase, Tags } from "lucide-react";

const ICONS = [Building2, MapPin, Briefcase, Tags];

type Props = { snapshot: Snapshot };

export function Section1Snapshot({ snapshot }: Props) {
  const tiles = [
    { label: "Vertical", value: snapshot.vertical },
    { label: "Service area", value: snapshot.serviceArea },
    { label: "Business model", value: snapshot.businessModel },
    { label: "Price band", value: snapshot.priceBand },
  ];
  return (
    <SectionShell number={1} title="Snapshot" subtitle="What the client sells, where, to whom, at what price.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tiles.map((t, i) => {
          const Icon = ICONS[i];
          return (
            <div key={t.label} className="flex gap-3 p-4 rounded-lg bg-[color:var(--accent-soft)]">
              <Icon className="h-5 w-5 mt-0.5 text-[color:var(--accent)]" />
              <div>
                <p className="text-xs font-mono uppercase tracking-wide text-[color:var(--muted)]">{t.label}</p>
                <p className="mt-1 text-sm font-medium leading-snug">{t.value}</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-base leading-relaxed border-l-2 border-[color:var(--accent)] pl-4 italic text-[color:var(--foreground)]/80">
        &ldquo;{snapshot.headline}&rdquo;
      </p>
    </SectionShell>
  );
}
