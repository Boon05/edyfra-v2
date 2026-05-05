export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}

export class RSSService {
  private feeds = [
    { name: "BBC Education", url: "https://feeds.bbci.co.uk/news/education/rss.xml" },
    { name: "Google News Kenya", url: "https://news.google.com/rss/search?q=education+kenya&hl=en-KE&gl=KE&ceid=KE:en" },
    { name: "Edutopia", url: "https://www.edutopia.org/rss.xml" }
  ];

  async fetchAllFeeds(): Promise<RSSItem[]> {
    const allItems: RSSItem[] = [];

    for (const feed of this.feeds) {
      try {
        const response = await fetch(feed.url);
        const xml = await response.text();
        const items = this.parseRSS(xml, feed.name);
        allItems.push(...items);
      } catch (error) {
        console.error(`Failed to fetch RSS feed: ${feed.name}`, error);
      }
    }

    // Sort by date (descending)
    return allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  }

  private parseRSS(xml: string, source: string): RSSItem[] {
    const items: RSSItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const titleRegex = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/;
    const linkRegex = /<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/;
    const descRegex = /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/;
    const dateRegex = /<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/;

    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      const title = itemXml.match(titleRegex)?.[1]?.trim() || "";
      const link = itemXml.match(linkRegex)?.[1]?.trim() || "";
      const description = itemXml.match(descRegex)?.[1]?.trim().replace(/<[^>]*>?/gm, '') || "";
      const pubDate = itemXml.match(dateRegex)?.[1]?.trim() || "";

      if (title && link) {
        items.push({ title, link, description, pubDate, source });
      }
    }

    return items.slice(0, 5); // Limit to 5 per feed
  }
}
