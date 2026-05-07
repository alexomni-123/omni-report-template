import type { Snapshot } from "@/lib/types";

type Props = {
  snapshot: Snapshot;
  generatedAt: string;
  generatedBy: string;
  agencyName: string;
};

/**
 * Print-only cover page. Hidden on screen (CSS .print-only is display:none),
 * visible only when the user prints. Becomes page 1 of the PDF.
 */
export function PrintCoverPage({ snapshot, generatedAt, generatedBy, agencyName }: Props) {
  return (
    <div
      className="print-only"
      style={{
        height: "100vh",
        padding: "1.2in 0.8in",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        breakAfter: "page",
        pageBreakAfter: "always",
      }}
    >
      <div>
        <p
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: "10pt",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--accent)",
            margin: 0,
          }}
        >
          Marketing Angle Report
        </p>
        <h1
          style={{
            fontSize: "32pt",
            lineHeight: 1.1,
            fontWeight: 700,
            margin: "0.4in 0 0.2in 0",
            color: "var(--foreground)",
            letterSpacing: "-0.01em",
          }}
        >
          {snapshot.vertical}
        </h1>
        <p style={{ fontSize: "13pt", color: "var(--muted)", margin: 0, lineHeight: 1.4 }}>
          {snapshot.serviceArea}
        </p>
        <p style={{ fontSize: "11pt", color: "var(--muted)", margin: "0.1in 0 0 0", lineHeight: 1.4 }}>
          Prepared for: <strong style={{ color: "var(--foreground)" }}>{snapshot.websiteUrl}</strong>
        </p>
      </div>

      <div
        style={{
          fontFamily: "ui-monospace, monospace",
          fontSize: "9pt",
          color: "var(--muted)",
          borderTop: "1px solid var(--card-border)",
          paddingTop: "0.2in",
          lineHeight: 1.6,
        }}
      >
        <p style={{ margin: 0 }}>
          <strong style={{ color: "var(--foreground)" }}>Prepared by</strong> · {agencyName}
        </p>
        <p style={{ margin: 0 }}>
          <strong style={{ color: "var(--foreground)" }}>Generated</strong> · {generatedAt} · {generatedBy}
        </p>
        <p style={{ margin: "0.1in 0 0 0", fontStyle: "italic" }}>
          AI-generated content marked per Oracle Rule 6 (transparency-first). Verbatim customer quotes attributed to source URLs throughout.
        </p>
      </div>
    </div>
  );
}
