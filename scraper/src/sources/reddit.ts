import type { RawComment } from "../types";

/**
 * Reddit .json endpoint scraper — no API key, no browser, no rate-limit account.
 * Reddit returns JSON for any URL with `.json` appended. Public, anonymous, free.
 *
 * Anti-throttle: realistic User-Agent + 1-2s jitter between requests.
 * Reddit rate-limits anonymous traffic to ~10 req/min, so we throttle conservatively.
 */

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const jitter = () => 1500 + Math.random() * 1500;

type RedditListing = {
  data?: {
    children?: { kind: string; data: RedditPost }[];
  };
};

type RedditPost = {
  id: string;
  title: string;
  selftext?: string;
  subreddit: string;
  permalink: string;
  author: string;
  score: number;
  created_utc: number;
  num_comments: number;
};

type RedditCommentNode = {
  kind: string;
  data: {
    body?: string;
    author?: string;
    permalink?: string;
    score?: number;
    created_utc?: number;
    replies?: RedditListing | "";
  };
};

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) {
      console.warn(`  ! ${res.status} ${url}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (e) {
    console.warn(`  ! fetch failed ${url}: ${(e as Error).message}`);
    return null;
  }
}

async function searchSubreddit(
  subreddit: string,
  query: string,
  limit: number
): Promise<RedditPost[]> {
  const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(
    query
  )}&restrict_sr=on&sort=relevance&limit=${limit}`;
  const data = await fetchJson<RedditListing>(url);
  return (data?.data?.children ?? []).map((c) => c.data);
}

function flattenComments(
  nodes: RedditCommentNode[],
  depth: number,
  context: { subreddit: string; threadTitle: string }
): RawComment[] {
  const out: RawComment[] = [];
  for (const n of nodes) {
    if (n.kind !== "t1" || !n.data.body) continue;
    out.push({
      source: "reddit",
      url: `https://reddit.com${n.data.permalink ?? ""}`,
      author: n.data.author,
      body: n.data.body,
      score: n.data.score,
      postedAt: n.data.created_utc
        ? new Date(n.data.created_utc * 1000).toISOString()
        : undefined,
      context,
    });
    if (depth > 0 && n.data.replies && typeof n.data.replies !== "string") {
      const replyChildren = (n.data.replies.data?.children ?? []) as RedditCommentNode[];
      out.push(...flattenComments(replyChildren, depth - 1, context));
    }
  }
  return out;
}

async function fetchComments(post: RedditPost, depth: number): Promise<RawComment[]> {
  const url = `https://www.reddit.com${post.permalink}.json?limit=100&depth=${depth + 1}`;
  const data = await fetchJson<[RedditListing, RedditListing]>(url);
  if (!data || data.length < 2) return [];
  const commentTree = (data[1]?.data?.children ?? []) as RedditCommentNode[];
  const comments = flattenComments(commentTree, depth, {
    subreddit: post.subreddit,
    threadTitle: post.title,
  });

  // Include the post body itself as a comment if it has self-text
  if (post.selftext && post.selftext.trim()) {
    comments.unshift({
      source: "reddit",
      url: `https://reddit.com${post.permalink}`,
      author: post.author,
      body: `${post.title}\n\n${post.selftext}`,
      score: post.score,
      postedAt: new Date(post.created_utc * 1000).toISOString(),
      context: { subreddit: post.subreddit, threadTitle: post.title },
    });
  }

  return comments;
}

export type RedditConfig = {
  subreddits: string[];
  queries: string[];
  maxPostsPerQuery: number;
  commentDepth: number;
};

export async function scrapeReddit(cfg: RedditConfig): Promise<RawComment[]> {
  const all: RawComment[] = [];
  const seenPosts = new Set<string>();

  for (const sub of cfg.subreddits) {
    for (const q of cfg.queries) {
      console.log(`reddit: r/${sub} ← "${q}"`);
      const posts = await searchSubreddit(sub, q, cfg.maxPostsPerQuery);
      for (const p of posts) {
        if (seenPosts.has(p.id)) continue;
        seenPosts.add(p.id);
        const comments = await fetchComments(p, cfg.commentDepth);
        all.push(...comments);
        await sleep(jitter());
      }
      await sleep(jitter());
    }
  }
  console.log(`reddit: collected ${all.length} comment bodies`);
  return all;
}
