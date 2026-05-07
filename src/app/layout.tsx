import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OMNI Report Template — Marketing Angle Report",
  description:
    "Client URL → marketing-angle report. Snapshot, ICP, pain points, keywords, competitor teardown, ranked angles, copy hooks, test plan.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
