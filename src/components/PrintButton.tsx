"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide px-3 py-1.5 rounded-full border border-[color:var(--card-border)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition-colors"
      aria-label="Print or save as PDF"
    >
      <Printer className="h-3.5 w-3.5" />
      Print / PDF
    </button>
  );
}
