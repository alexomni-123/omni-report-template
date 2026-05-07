export type Source = "reddit" | "hardwarezone" | "renotalk" | "google-maps" | "carousell" | "youtube";

export type RawComment = {
  source: Source;
  url: string;
  author?: string;
  postedAt?: string;
  body: string;
  score?: number;
  context?: {
    threadTitle?: string;
    subreddit?: string;
    business?: string;
  };
};

export type Phrase = {
  text: string;
  count: number;
  citations: { url: string; snippet: string }[];
  sentiment?: number;
};

export type ScrapeRun = {
  config: string;
  startedAt: string;
  finishedAt: string;
  bySource: Record<Source, { commentsScraped: number; durationMs: number; errors: string[] }>;
  totalComments: number;
};
