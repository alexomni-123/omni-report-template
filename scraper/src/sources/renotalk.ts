import * as cheerio from "cheerio";
import type { RawComment } from "../types";

/**
 * Renotalk uses Invision Power Board. Their /forum/search/?q=… endpoint
 * works without a session token (unlike HardwareZone's), so we hit it directly.
 *
 * Thread URL pattern: /forum/topic/<id>-<slug>/
 * Each post on the thread is wrapped in <article class="cPost"> (or .ipsComment)
 * with body text in [data-role="commentContent"] / .cPost_contentWrap.
 */

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const jitter = () => 800 + Math.random() * 1200;

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, "Accept-Language": "en-SG,en;q=0.9" },
      redirect: "follow",
    });
    if (!res.ok) {
      console.warn(`  ! ${res.status} ${url}`);
      return null;
    }
    return await res.text();
  } catch (e) {
    console.warn(`  ! fetch failed ${url}: ${(e as Error).message}`);
    return null;
  }
}

async function searchRenotalk(query: string, maxThreads: number): Promise<string[]> {
  const url = `https://www.renotalk.com/forum/search/?q=${encodeURIComponent(
    query
  )}&type=forums_topic&search_and_or=or&sortby=relevancy`;
  const html = await fetchHtml(url);
  if (!html) return [];
  const $ = cheerio.load(html);
  const links = new Set<string>();
  $("a[href*='/topic/']").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    const m = href.match(/\/topic\/\d+-[a-z0-9-]+\/?/i);
    if (m) {
      const abs = href.startsWith("http") ? href : new URL(m[0], "https://www.renotalk.com/forum/").toString();
      links.add(abs.split("?")[0].replace(/\/$/, "/"));
    }
  });
  // Filter: keep only threads whose slug looks window-relevant
  const slug = (u: string) => u.toLowerCase();
  const onTopic = [...links].filter((u) =>
    /(window|casement|sliding|glaz|seepage|leak|aircon|grille|aluminium|aluminum|noise|monsoon|mou?ld|reno|hdb)/.test(
      slug(u)
    )
  );
  return onTopic.slice(0, maxThreads);
}

async function scrapeThread(threadUrl: string): Promise<RawComment[]> {
  const html = await fetchHtml(threadUrl);
  if (!html) return [];
  const $ = cheerio.load(html);
  const title =
    $("h1.ipsType_pageTitle, h1[itemprop='headline'], h1").first().text().trim() ||
    $("title").text().trim();
  const posts: RawComment[] = [];
  $("article.cPost, .ipsComment, [data-role='comment']").each((_, el) => {
    const $el = $(el);
    const author = $el
      .find(".ipsBadge_text, .ipsType_sectionHead a, [itemprop='author'] a")
      .first()
      .text()
      .trim();
    const body = $el
      .find("[data-role='commentContent'], .cPost_contentWrap, .ipsType_richText, [itemprop='text']")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim();
    if (!body || body.length < 30) return;
    const time = $el.find("time").first().attr("datetime");
    const cid = $el.attr("id") ?? "";
    posts.push({
      source: "renotalk",
      url: cid ? `${threadUrl}#${cid}` : threadUrl,
      author,
      body,
      postedAt: time,
      context: { threadTitle: title },
    });
  });
  return posts;
}

export type RenotalkConfig = {
  queries: string[];
  maxThreadsPerQuery: number;
};

export async function scrapeRenotalkForum(cfg: RenotalkConfig): Promise<RawComment[]> {
  const all: RawComment[] = [];
  const seenThreads = new Set<string>();

  for (const q of cfg.queries) {
    console.log(`renotalk: searching "${q}"`);
    const threads = await searchRenotalk(q, cfg.maxThreadsPerQuery);
    for (const url of threads) {
      if (seenThreads.has(url)) continue;
      seenThreads.add(url);
      const posts = await scrapeThread(url);
      if (posts.length > 0) console.log(`  ✓ ${posts.length} posts ← ${url.split("/").slice(-2)[0]}`);
      all.push(...posts);
      await sleep(jitter());
    }
    await sleep(jitter());
  }
  console.log(`renotalk: collected ${all.length} posts`);
  return all;
}
