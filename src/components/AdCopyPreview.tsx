import type { TestPlanCreative } from "@/lib/types";
import { ThumbsUp, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react";

type Props = { plan: TestPlanCreative[] };

/**
 * Mock Meta / IG / TikTok ad-like preview cards. Renders each §8 test plan
 * creative as a feed-card mockup so the agency can show the client what
 * the creative will look like before any production spend.
 *
 * Not a perfect Meta UI replica (which would invite trademark concerns) — a
 * generic "social feed card" treatment that conveys hierarchy + framing.
 */
export function AdCopyPreview({ plan }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {plan.map((c) => {
        const isReel = /reel|tiktok|video/i.test(c.format);
        const platform = isReel ? "TikTok / IG Reels" : /lead-ad|long.form/i.test(c.format) ? "Meta Lead Ad" : "Meta · Instagram";
        const aspect = isReel ? "aspect-[9/16]" : "aspect-[4/5]";
        return (
          <div key={c.order} className="rounded-lg overflow-hidden border border-[color:var(--card-border)] bg-[color:var(--card)]">
            {/* Header — sponsored / page name */}
            <div className="flex items-center justify-between p-3 border-b border-[color:var(--card-border)]">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[color:var(--accent)]/15 flex items-center justify-center text-[color:var(--accent)] text-xs font-mono font-bold">
                  W
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-semibold">Window Brand SG</p>
                  <p className="text-[10px] text-[color:var(--muted)]">Sponsored · {platform}</p>
                </div>
              </div>
              <MoreHorizontal className="h-4 w-4 text-[color:var(--muted)]" />
            </div>

            {/* Headline / primary copy */}
            <div className="p-3 text-sm leading-snug">
              <p className="font-semibold mb-1">{c.angleName}</p>
              <p className="text-[color:var(--foreground)]/85 text-xs leading-relaxed line-clamp-4">
                {c.primaryCopy}
              </p>
            </div>

            {/* Visual placeholder */}
            <div
              className={`${aspect} bg-[color:var(--accent-soft)] flex items-center justify-center text-center px-4`}
              style={{ backgroundImage: "linear-gradient(135deg, var(--accent-soft) 0%, color-mix(in oklab, var(--accent) 8%, var(--card)) 100%)" }}
            >
              <p className="text-xs font-mono text-[color:var(--muted)] uppercase tracking-widest">
                [creative placeholder]
                <br />
                {c.format.split(",")[0].trim()}
              </p>
            </div>

            {/* CTA card */}
            <div className="flex items-center justify-between p-3 border-t border-b border-[color:var(--card-border)] bg-[color:var(--background)]">
              <div className="text-xs leading-tight">
                <p className="text-[10px] uppercase tracking-wide text-[color:var(--muted)] font-mono">example-windows.sg</p>
                <p className="font-semibold">{c.cta.replace(/\s*→\s*$/, "")}</p>
              </div>
              <button className="text-[10px] font-semibold uppercase tracking-wide px-3 py-1.5 rounded-md bg-[color:var(--accent)] text-white">
                Learn more
              </button>
            </div>

            {/* Reactions */}
            <div className="flex items-center justify-between p-2 text-[color:var(--muted)] text-xs">
              <button className="flex items-center gap-1 hover:text-[color:var(--accent)]">
                <ThumbsUp className="h-3.5 w-3.5" /> Like
              </button>
              <button className="flex items-center gap-1 hover:text-[color:var(--accent)]">
                <MessageCircle className="h-3.5 w-3.5" /> Comment
              </button>
              <button className="flex items-center gap-1 hover:text-[color:var(--accent)]">
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
              <button className="flex items-center gap-1 hover:text-[color:var(--accent)]">
                <Bookmark className="h-3.5 w-3.5" /> Save
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
