import * as cheerio from "cheerio";
import type { RawComment, Source } from "../types";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const jitter = () => 800 + Math.random() * 1200;

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "en-SG,en;q=0.9" } });
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

/**
 * HardwareZone EDMW uses XenForo. Threads have URL pattern .../threads/<title>.<id>/
 * Posts within a thread are <article class="message"> with .bbWrapper for body.
 */
async function scrapeHardwarezoneThread(threadUrl: string): Promise<RawComment[]> {
  const html = await fetchHtml(threadUrl);
  if (!html) return [];
  const $ = cheerio.load(html);
  const title = $("h1.p-title-value").text().trim() || $("title").text().trim();
  const posts: RawComment[] = [];
  $("article.message").each((_, el) => {
    const $el = $(el);
    const author = $el.find(".message-name").first().text().trim();
    const body = $el.find(".bbWrapper").first().text().trim();
    const time = $el.find("time").first().attr("datetime");
    const postId = $el.attr("data-content");
    if (!body) return;
    posts.push({
      source: "hardwarezone",
      url: postId ? `${threadUrl}#${postId}` : threadUrl,
      author,
      body,
      postedAt: time,
      context: { threadTitle: title },
    });
  });
  return posts;
}

async function searchHardwarezone(base: string, query: string, max: number): Promise<string[]> {
  // XenForo search returns thread links — easiest path is to fetch the forum index
  // and search Google site: as backup. For v1 we just hit the forum index for recent threads
  // matching the query in title (XenForo `/search/` requires a session token).
  const indexHtml = await fetchHtml(base);
  if (!indexHtml) return [];
  const $ = cheerio.load(indexHtml);
  const links: string[] = [];
  const q = query.toLowerCase();
  $("a[href*='/threads/']").each((_, el) => {
    const href = $(el).attr("href");
    const text = $(el).text().toLowerCase();
    if (href && text.includes(q)) {
      const abs = href.startsWith("http") ? href : new URL(href, base).toString();
      if (!links.includes(abs)) links.push(abs);
    }
  });
  return links.slice(0, max);
}

/**
 * Renotalk uses Invision Power Board. Threads have URL pattern .../topic/<id>-<slug>/
 */
async function scrapeRenotalkTopic(topicUrl: string): Promise<RawComment[]> {
  const html = await fetchHtml(topicUrl);
  if (!html) return [];
  const $ = cheerio.load(html);
  const title = $("h1.ipsType_pageTitle").first().text().trim() || $("title").text().trim();
  const posts: RawComment[] = [];
  $("article.cPost, .cPost").each((_, el) => {
    const $el = $(el);
    const author = $el.find(".ipsType_sectionHead a, .ipsBadge_text").first().text().trim();
    const body = $el.find(".cPost_contentWrap, [data-role='commentContent']").first().text().trim();
    const time = $el.find("time").first().attr("datetime");
    if (!body) return;
    posts.push({
      source: "renotalk",
      url: topicUrl,
      author,
      body,
      postedAt: time,
      context: { threadTitle: title },
    });
  });
  return posts;
}

async function searchRenotalk(base: string, query: string, max: number): Promise<string[]> {
  const indexHtml = await fetchHtml(base);
  if (!indexHtml) return [];
  const $ = cheerio.load(indexHtml);
  const links: string[] = [];
  const q = query.toLowerCase();
  $("a[href*='/topic/']").each((_, el) => {
    const href = $(el).attr("href");
    const text = $(el).text().toLowerCase();
    if (href && text.includes(q)) {
      const abs = href.startsWith("http") ? href : new URL(href, base).toString();
      if (!links.includes(abs)) links.push(abs);
    }
  });
  return links.slice(0, max);
}

export type ForumsConfig = {
  hardwarezone: { base: string; queries: string[]; maxPostsPerQuery: number };
  renotalk: { base: string; queries: string[]; maxPostsPerQuery: number };
};

export async function scrapeForums(cfg: ForumsConfig): Promise<RawComment[]> {
  const all: RawComment[] = [];

  const sources: { name: Source; cfg: typeof cfg.hardwarezone; search: typeof searchHardwarezone; scrape: typeof scrapeHardwarezoneThread }[] = [
    { name: "hardwarezone", cfg: cfg.hardwarezone, search: searchHardwarezone, scrape: scrapeHardwarezoneThread },
    { name: "renotalk", cfg: cfg.renotalk, search: searchRenotalk, scrape: scrapeRenotalkTopic },
  ];

  for (const s of sources) {
    for (const q of s.cfg.queries) {
      console.log(`${s.name}: searching for "${q}"`);
      const threadUrls = await s.search(s.cfg.base, q, s.cfg.maxPostsPerQuery);
      for (const url of threadUrls) {
        const comments = await s.scrape(url);
        all.push(...comments);
        await sleep(jitter());
      }
    }
  }

  console.log(`forums: collected ${all.length} posts`);
  return all;
}
