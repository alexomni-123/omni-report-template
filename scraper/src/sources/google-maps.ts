import { chromium as chromiumExtra } from "playwright-extra";
// @ts-expect-error — puppeteer-extra-plugin-stealth ships with broad-typed module
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import type { Browser } from "playwright";
import type { RawComment } from "../types";

chromiumExtra.use(StealthPlugin());

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type GoogleMapsConfig = {
  businesses: string[];
  reviewsPerBusiness: number;
};

/**
 * Headless-Chromium scrape of Google Maps reviews via the public maps URL.
 * Stealth plugin masks navigator.webdriver, languages, plugins, WebGL fingerprint, etc.
 *
 * Best-effort: Google may rate-limit / serve a CAPTCHA. On failure we log and move on.
 */
export async function scrapeGoogleMaps(cfg: GoogleMapsConfig): Promise<RawComment[]> {
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

    for (const business of cfg.businesses) {
      console.log(`google-maps: ${business}`);
      const page = await ctx.newPage();
      try {
        await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(business)}`, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });
        await sleep(2500);

        // Click first result if a list is shown
        const firstResult = page.locator("a[href*='/maps/place/']").first();
        if (await firstResult.count()) {
          await firstResult.click();
          await sleep(2500);
        }

        // Click the "Reviews" tab
        const reviewsTab = page.locator("button[aria-label*='Reviews'], button:has-text('Reviews')").first();
        if (await reviewsTab.count()) {
          await reviewsTab.click();
          await sleep(2000);
        }

        // Sort by Newest (catches recent customer language)
        const sortBtn = page.locator("button:has-text('Sort'), button[aria-label*='Sort']").first();
        if (await sortBtn.count()) {
          await sortBtn.click();
          await sleep(800);
          const newestOption = page.locator("div[role='menuitemradio']:has-text('Newest')").first();
          if (await newestOption.count()) {
            await newestOption.click();
            await sleep(2000);
          }
        }

        // Auto-scroll the reviews pane until enough reviews load
        const reviewsPane = page.locator("div[role='main'] [class*='dS8AEf'], div[role='main'] div.m6QErb").last();
        for (let i = 0; i < Math.ceil(cfg.reviewsPerBusiness / 10) + 2; i++) {
          await reviewsPane.evaluate((el: Element) => el.scrollBy(0, 1200)).catch(() => {});
          await sleep(900 + Math.random() * 600);
        }

        // Click any "More" expanders so full review text is in DOM
        const moreBtns = page.locator("button.w8nwRe, button[aria-label='See more']");
        const cnt = await moreBtns.count();
        for (let i = 0; i < Math.min(cnt, cfg.reviewsPerBusiness); i++) {
          await moreBtns.nth(i).click().catch(() => {});
        }
        await sleep(800);

        // Extract review bodies
        const extracted = await page.evaluate(() => {
          const out: { author: string; body: string; rating?: number }[] = [];
          const blocks = document.querySelectorAll(
            "div[data-review-id], div.jftiEf"
          );
          blocks.forEach((b) => {
            const authorEl = b.querySelector(".d4r55, .TSUbDb a");
            const bodyEl = b.querySelector(".wiI7pd, span.review-full-text, .MyEned span");
            const ratingEl = b.querySelector("span[role='img'][aria-label*='star']");
            const author = authorEl?.textContent?.trim() ?? "";
            const body = bodyEl?.textContent?.trim() ?? "";
            const ratingMatch = ratingEl?.getAttribute("aria-label")?.match(/(\d+)/);
            const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : undefined;
            if (body) out.push({ author, body, rating });
          });
          return out;
        });

        const businessUrl = page.url();
        for (const r of extracted.slice(0, cfg.reviewsPerBusiness)) {
          all.push({
            source: "google-maps",
            url: businessUrl,
            author: r.author,
            body: r.body,
            score: r.rating,
            context: { business },
          });
        }
        console.log(`  ✓ ${business}: ${Math.min(extracted.length, cfg.reviewsPerBusiness)} reviews`);
      } catch (e) {
        console.warn(`  ! ${business}: ${(e as Error).message}`);
      } finally {
        await page.close();
        await sleep(1500 + Math.random() * 1500); // jitter between businesses
      }
    }
  } finally {
    if (browser) await browser.close();
  }

  console.log(`google-maps: collected ${all.length} reviews`);
  return all;
}
