import { chromium as chromiumExtra } from "playwright-extra";
// @ts-expect-error
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import type { Browser } from "playwright";
import type { RawComment } from "../types";

chromiumExtra.use(StealthPlugin());

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * HardwareZone EDMW returns 403 to plain User-Agent fetches (Cloudflare-style
 * bot protection). With Playwright stealth + a realistic viewport + a real
 * navigation flow (homepage → search → thread), we get the same access a
 * regular browser does.
 *
 * If HWZ also serves a CAPTCHA in this flow, we log + skip the thread and
 * keep going — partial corpus is still useful.
 */

export type HardwarezoneConfig = {
  queries: string[];
  maxThreadsPerQuery: number;
};

export async function scrapeHardwarezone(cfg: HardwarezoneConfig): Promise<RawComment[]> {
  const all: RawComment[] = [];
  let browser: Browser | null = null;

  try {
    browser = await chromiumExtra.launch({ headless: true });
    const ctx = await browser.newContext({
      locale: "en-SG",
      timezoneId: "Asia/Singapore",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 900 },
    });

    // Warm-up: visit homepage so any anti-bot checks see a real session
    const home = await ctx.newPage();
    try {
      await home.goto("https://forums.hardwarezone.com.sg/", {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      await sleep(2000);
    } catch (e) {
      console.warn(`hwz: homepage warmup failed: ${(e as Error).message}`);
    }
    await home.close();

    for (const q of cfg.queries) {
      console.log(`hardwarezone: searching "${q}"`);
      const sp = await ctx.newPage();
      try {
        // XenForo's quick-search via URL (no form submission needed)
        const searchUrl = `https://forums.hardwarezone.com.sg/search/?q=${encodeURIComponent(
          q
        )}&o=relevance`;
        const resp = await sp.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
        const status = resp?.status() ?? 0;
        if (status >= 400) {
          console.warn(`  ! ${status} on search "${q}"`);
          await sp.close();
          continue;
        }
        await sleep(1500);

        // Extract thread URLs from search results
        const threadUrls = await sp.evaluate(() => {
          const links = Array.from(
            document.querySelectorAll("a[href*='/threads/']")
          ) as HTMLAnchorElement[];
          return [
            ...new Set(
              links
                .map((a) => a.href.split("?")[0].replace(/\/post-\d+$/, "/"))
                .filter((u) => /\/threads\/[a-z0-9-]+\.\d+/i.test(u))
            ),
          ];
        });

        const targets = threadUrls.slice(0, cfg.maxThreadsPerQuery);
        for (const tu of targets) {
          const tp = await ctx.newPage();
          try {
            const tresp = await tp.goto(tu, { waitUntil: "domcontentloaded", timeout: 25000 });
            const ts = tresp?.status() ?? 0;
            if (ts >= 400) {
              console.warn(`  ! ${ts} on thread ${tu}`);
              continue;
            }
            await sleep(1200);

            const data = await tp.evaluate(() => {
              const title =
                (document.querySelector("h1.p-title-value") as HTMLElement | null)
                  ?.innerText?.trim() ??
                document.title.trim();
              const posts: { author: string; body: string; postId: string }[] = [];
              document.querySelectorAll("article.message").forEach((el) => {
                const author = (el.querySelector(".message-name") as HTMLElement | null)?.innerText?.trim() ?? "";
                const body =
                  (el.querySelector(".bbWrapper") as HTMLElement | null)?.innerText?.trim() ?? "";
                const postId = (el.getAttribute("data-content") ?? "").trim();
                if (body && body.length > 30) posts.push({ author, body, postId });
              });
              return { title, posts };
            });

            for (const p of data.posts) {
              all.push({
                source: "hardwarezone",
                url: p.postId ? `${tu}#${p.postId}` : tu,
                author: p.author,
                body: p.body,
                context: { threadTitle: data.title },
              });
            }
            if (data.posts.length > 0) {
              console.log(`  ✓ ${data.posts.length} posts ← ${tu.split("/threads/")[1]?.slice(0, 60)}`);
            }
          } catch (e) {
            console.warn(`  ! thread error ${tu}: ${(e as Error).message}`);
          } finally {
            await tp.close();
            await sleep(900 + Math.random() * 1100);
          }
        }
      } catch (e) {
        console.warn(`hwz: search "${q}" error: ${(e as Error).message}`);
      } finally {
        await sp.close();
      }
    }
  } finally {
    if (browser) await browser.close();
  }

  console.log(`hardwarezone: collected ${all.length} posts`);
  return all;
}
