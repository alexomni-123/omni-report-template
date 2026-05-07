import type { ReactNode } from "react";
import { clsx } from "clsx";

type Props = {
  number: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function SectionShell({ number, title, subtitle, children, className }: Props) {
  return (
    <section className={clsx("report-card p-4 sm:p-6 md:p-8", className)}>
      <header className="mb-6 flex items-baseline gap-4">
        <span className="text-sm font-mono text-[color:var(--muted)]">
          {String(number).padStart(2, "0")}
        </span>
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-sm text-[color:var(--muted)]">{subtitle}</p>
          )}
        </div>
      </header>
      {children}
    </section>
  );
}
