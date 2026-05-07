import { report } from "@/data/load-report";
import { ReportHeader } from "@/components/ReportHeader";
import { Section1Snapshot } from "@/components/sections/Section1Snapshot";
import { Section2ICP } from "@/components/sections/Section2ICP";
import { Section3PainPoints } from "@/components/sections/Section3PainPoints";
import { Section4Keywords } from "@/components/sections/Section4Keywords";
import { Section5Competitors } from "@/components/sections/Section5Competitors";
import { Section6Angles } from "@/components/sections/Section6Angles";
import { Section7CopyHooks } from "@/components/sections/Section7CopyHooks";
import { Section8TestPlan } from "@/components/sections/Section8TestPlan";
import { Section9NextActions } from "@/components/sections/Section9NextActions";
import { DataQualityTable } from "@/components/DataQualityTable";
import { PrintCoverPage } from "@/components/PrintCoverPage";
import { ExecSummary } from "@/components/ExecSummary";
import { Bibliography } from "@/components/Bibliography";

const AGENCY_NAME = "OMNI Digital · 15-person agency · alex@omnidigital.com.sg";

export default function Home() {
  const r = report;
  const realCount = Object.values(r.sourceTotals).reduce((s, n) => s + n, 0);
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16" data-brand="omnidigital">
      <PrintCoverPage
        snapshot={r.snapshot}
        generatedAt={r.generatedAt}
        generatedBy={r.generatedBy}
        agencyName={AGENCY_NAME}
      />
      <ReportHeader generatedAt={r.generatedAt} generatedBy={r.generatedBy} snapshot={r.snapshot} />

      {r.isRealData ? (
        <div className="mb-8 rounded-lg border border-emerald-300/40 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 text-sm space-y-1">
          <div>
            <span className="font-mono uppercase tracking-wide text-[11px] text-emerald-700 dark:text-emerald-400">Real data + LLM synthesis</span>
            {" — "}
            Pain points and keywords are extracted from {realCount.toLocaleString()} scraped Reddit comments
            {Object.entries(r.sourceTotals).length > 0 && (
              <span className="text-[color:var(--muted)]">
                {" ("}
                {Object.entries(r.sourceTotals).map(([s, n]) => `${s}: ${n.toLocaleString()}`).join(", ")}
                {")"}
              </span>
            )}
            . Verbatim evidence quotes below are curated by Claude reading the corpus directly. Marketing angles, copy hooks, and test plan are LLM-synthesized from the real evidence.
          </div>
          <div className="text-xs text-[color:var(--muted)]">
            Honest caveat: corpus is Reddit-only and skews younger / tech-savvy. Validate against Facebook Groups + Google reviews of competitor businesses (which represent the older HDB demographic) before shipping to a real client.
          </div>
        </div>
      ) : (
        <div className="mb-8 rounded-lg border border-amber-300/40 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm">
          <span className="font-mono uppercase tracking-wide text-[11px] text-amber-700 dark:text-amber-500">Sample data</span>
          {" — "}
          Run <code className="font-mono">cd scraper &amp;&amp; bun run scrape:all &amp;&amp; bun run build-report</code> to replace pain points and keywords with real customer language.
        </div>
      )}

      <ExecSummary pains={r.painPoints} angles={r.angles} realCount={realCount} />

      <div className="space-y-6">
        <Section1Snapshot snapshot={r.snapshot} />
        <Section2ICP icp={r.icp} icpInferred={r.icpInferred} />
        <Section3PainPoints painPoints={r.painPoints} press={r.pressContext} />
        <Section4Keywords keywords={r.keywords} googleSuggest={r.googleSuggest} />
        <Section5Competitors competitors={r.competitors} gap={r.competitorGap} />
        <Section6Angles angles={r.angles} />
        <Section7CopyHooks hooks={r.copyHooks} angles={r.angles} />
        <Section8TestPlan plan={r.testPlan} benchmarks={r.sgMetaBenchmarks} />
        <Section9NextActions />
      </div>

      <div className="mt-12">
        <DataQualityTable />
        <Bibliography
          pressContext={r.pressContext}
          competitors={r.competitors}
          evidence={r.painPoints.flatMap((p) => p.evidence ?? [])}
          copyHookSources={r.copyHooks.flatMap((h) => h.sources ?? [])}
        />
      </div>

      <footer className="mt-16 pt-6 border-t border-[color:var(--card-border)] text-xs font-mono text-[color:var(--muted)] flex flex-wrap gap-x-4 gap-y-1 justify-between">
        <span>OMNI Report Template · v0.1</span>
        <span>Sample data — HDB &amp; Condo Window Replacement, Singapore</span>
        <span>[Generated with {r.generatedBy}]</span>
      </footer>
    </main>
  );
}
