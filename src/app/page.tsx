import { sampleReport } from "@/data/sample";
import { ReportHeader } from "@/components/ReportHeader";
import { Section1Snapshot } from "@/components/sections/Section1Snapshot";
import { Section2ICP } from "@/components/sections/Section2ICP";
import { Section3PainPoints } from "@/components/sections/Section3PainPoints";
import { Section4Keywords } from "@/components/sections/Section4Keywords";
import { Section5Competitors } from "@/components/sections/Section5Competitors";
import { Section6Angles } from "@/components/sections/Section6Angles";
import { Section7CopyHooks } from "@/components/sections/Section7CopyHooks";
import { Section8TestPlan } from "@/components/sections/Section8TestPlan";

export default function Home() {
  const r = sampleReport;
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16">
      <ReportHeader generatedAt={r.generatedAt} generatedBy={r.generatedBy} snapshot={r.snapshot} />

      <div className="space-y-6">
        <Section1Snapshot snapshot={r.snapshot} />
        <Section2ICP icp={r.icp} />
        <Section3PainPoints painPoints={r.painPoints} />
        <Section4Keywords keywords={r.keywords} />
        <Section5Competitors competitors={r.competitors} />
        <Section6Angles angles={r.angles} />
        <Section7CopyHooks hooks={r.copyHooks} angles={r.angles} />
        <Section8TestPlan plan={r.testPlan} />
      </div>

      <footer className="mt-16 pt-6 border-t border-[color:var(--card-border)] text-xs font-mono text-[color:var(--muted)] flex flex-wrap gap-x-4 gap-y-1 justify-between">
        <span>OMNI Report Template · v0.1</span>
        <span>Sample data — Window Installation vertical, GTA</span>
        <span>[Generated with {r.generatedBy}]</span>
      </footer>
    </main>
  );
}
