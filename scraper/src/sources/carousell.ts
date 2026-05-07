import { chromium as chromiumExtra } from "playwright-extra";
// @ts-expect-error — puppeteer-extra-plugin-stealth ships with broad-typed module
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import type { Browser } from "playwright";
import type { RawComment } from "../types";

chromiumExtra.use(StealthPlugin());

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type CarousellConfig = {
  searchTerms: string[];
  maxListings: number;
};

/**
 * Carousell SG listings are useful for: title language, price language, and questions
 * in the Q&A section of each listing — those are pure customer voice.
 *
 * Stealth plugin handles the JS-rendered listing cards; we extract title + description
 * and any visible Q&A blocks.
 */
export async function scrapeCarousell(cfg: CarousellConfig): Promise<RawComment[]> {
  const all: RawComment[] = [];
  let browser: Browser | null = null;

  try {
    browser = await chromiumExtra.launch({ headless: true });
    const ctx = await browser.newContext({
      locale: "en-SG",
      timezoneId: "Asia/Singapore",
      viewport: { width: 1280, height: 900 },
    });

    for (const term of cfg.searchTerms) {
      console.log(`carousell: "${term}"`);
      const page = await ctx.newPage();
      try {
        const searchUrl = `https://www.carousell.sg/search/${encodeURIComponent(term)}?addRecent=true&canChangeKeyword=true&includeSuggestions=true`;
        await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
        await sleep(2500);

        // Scroll to load more listings
        for (let i = 0; i < 4; i++) {
          await page.evaluate(() => window.scrollBy(0, 1500));
          await sleep(900);
        }

        const listingHrefs = await page.evaluate(() => {
          const links = Array.from(
            document.querySelectorAll("a[href*='/p/']")
          ) as HTMLAnchorElement[];
          return [...new Set(links.map((a) => a.href))];
        });

        for (const href of listingHrefs.slice(0, cfg.maxListings)) {
          const lp = await ctx.newPage();
          try {
            await lp.goto(href, { waitUntil: "domcontentloaded", timeout: 25000 });
            await sleep(1500);
            const data = await lp.evaluate(() => {
              const title = document.querySelector("h1")?.textContent?.trim() ?? "";
              const desc =
                (document.querySelector("[data-testid='listing-description']") as HTMLElement | null)
                  ?.innerText?.trim() ?? "";
              return { title, desc };
            });
            const body = `${data.title}\n\n${data.desc}`.trim();
            if (body) {
              all.push({
                source: "carousell",
                url: href,
                body,
                context: { threadTitle: data.title },
              });
            }
          } catch (e) {
            console.warn(`  ! ${href}: ${(e as Error).message}`);
          } finally {
            await lp.close();
            await sleep(600 + Math.random() * 800);
          }
        }
      } catch (e) {
        console.warn(`  ! search "${term}": ${(e as Error).message}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    if (browser) await browser.close();
  }

  console.log(`carousell: collected ${all.length} listings`);
  return all;
}
