import Parser from 'rss-parser';

export interface UpdateItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

/**
 * List of RSS feeds to pull news from. Additional feeds can be added here. The
 * `source` label will be attached to each item to identify where the story
 * originated from.
 */
export const FEEDS: { url: string; source: string }[] = [
  {
    url: 'https://www.fifa.com/rss/news',
    source: 'FIFA',
  },
  {
    url: 'https://news.google.com/rss/search?q=FIFA%20World%20Cup&hl=en-US&gl=US&ceid=US:en',
    source: 'Google News',
  },
];

const parser = new Parser();

/**
 * Fetch the latest updates from configured RSS feeds. This function attempts
 * to fetch and normalise items from all feeds, returning a combined list
 * sorted by publication date (most recent first). Only the first 6 items of
 * each feed are retained to limit the amount of data served on the homepage.
 */
export async function fetchUpdates(): Promise<UpdateItem[]> {
  const allItems: UpdateItem[] = [];
  for (const feed of FEEDS) {
    try {
      const feedData = await parser.parseURL(feed.url);
      const items = (feedData.items || []).slice(0, 6).map((item) => ({
        title: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate || '',
        source: feed.source,
      }));
      allItems.push(...items);
    } catch (err) {
      console.warn(`Failed to fetch feed ${feed.url}`, err);
    }
  }
  // Sort by publication date (descending)
  return allItems.sort((a, b) => (new Date(a.pubDate).getTime() < new Date(b.pubDate).getTime() ? 1 : -1));
}