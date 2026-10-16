import { XMLParser } from 'npm:fast-xml-parser@4.5.3';

interface Source {
  id: string;
  name: string;
  url: string;
}

interface NewsItem {
  title: string;
  link: string;
  published: string;
  source: string;
  summary: string;
}

const SOURCES: Source[] = [
  { id: 'heise', name: 'heise online', url: 'https://www.heise.de/rss/heise-atom.xml' },
  { id: 'golem', name: 'Golem', url: 'https://rss.golem.de/rss.php?feed=RSS2.0' },
  { id: 't3n', name: 't3n', url: 'https://t3n.de/feed/' },
  { id: 'spiegel', name: 'Spiegel Netzwelt', url: 'https://www.spiegel.de/netzwelt/index.rss' },
  { id: 'zeit', name: 'Zeit Digital', url: 'https://newsfeed.zeit.de/digital/index' },
  { id: 'decoder', name: 'The Decoder', url: 'https://the-decoder.de/feed/' },
  { id: 'verge', name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
  { id: 'ars', name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' },
  { id: 'wired', name: 'Wired', url: 'https://www.wired.com/feed/rss' },
  {
    id: 'mit',
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
  },
  {
    id: 'venturebeat',
    name: 'VentureBeat',
    url: 'https://venturebeat.com/category/ai/feed/',
  },
  { id: 'bbc', name: 'BBC Technology', url: 'https://feeds.bbci.co.uk/news/technology/rss.xml' },
  {
    id: 'guardian',
    name: 'The Guardian Technology',
    url: 'https://www.theguardian.com/technology/rss',
  },
  { id: 'engadget', name: 'Engadget', url: 'https://www.engadget.com/rss.xml' },
];

const MAX_ITEMS = 80;
const TIMEOUT_MS = 8000;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'public, max-age=900',
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
});

/**
 * Turns a raw XML value (string, CDATA object or array) into plain text.
 * @param value Parsed XML value.
 * @returns Trimmed text without HTML tags.
 */
function plainText(value: unknown): string {
  if (value === undefined || value === null) return '';
  if (Array.isArray(value)) return plainText(value[0]);
  if (typeof value === 'object') return plainText((value as Record<string, unknown>)['#text']);
  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts the link from an RSS item or an Atom entry.
 * @param value Parsed link value.
 * @returns The URL of the item.
 */
function linkOf(value: unknown): string {
  if (Array.isArray(value)) {
    const alternate =
      value.find((entry) => typeof entry === 'object' && entry?.['@_rel'] !== 'self') ?? value[0];
    return linkOf(alternate);
  }
  if (typeof value === 'object' && value !== null) {
    const link = value as Record<string, unknown>;
    return String(link['@_href'] ?? link['#text'] ?? '');
  }
  return String(value ?? '');
}

/**
 * Reads the items of a feed, whether it is RSS 2.0, RSS 1.0 or Atom.
 * @param xml Raw feed text.
 * @param source The source the feed belongs to.
 * @returns Normalized news items.
 */
function parseFeed(xml: string, source: Source): NewsItem[] {
  const doc = parser.parse(xml);
  const raw = doc?.rss?.channel?.item ?? doc?.['rdf:RDF']?.item ?? doc?.feed?.entry ?? [];
  const entries = Array.isArray(raw) ? raw : [raw];

  return entries
    .map((entry: Record<string, unknown>) => {
      const published = plainText(
        entry.pubDate ?? entry['dc:date'] ?? entry.published ?? entry.updated,
      );
      return {
        title: plainText(entry.title),
        link: linkOf(entry.link),
        published: published ? new Date(published).toISOString() : '',
        source: source.name,
        summary: plainText(entry.description ?? entry.summary ?? entry.content).slice(0, 300),
      };
    })
    .filter((item: NewsItem) => item.title && item.link);
}

/**
 * Downloads and parses one source.
 * @param source The source to fetch.
 * @returns Items of the source, or an error for a failed source.
 */
async function loadSource(source: Source): Promise<{ items: NewsItem[]; failed?: string }> {
  try {
    const response = await fetch(source.url, {
      headers: { 'User-Agent': 'KI-LernApp/1.0 (RSS reader)' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return { items: [], failed: source.name };
    return { items: parseFeed(await response.text(), source) };
  } catch {
    return { items: [], failed: source.name };
  }
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  const results = await Promise.all(SOURCES.map(loadSource));

  const items = results
    .flatMap((result) => result.items)
    .sort((a, b) => (b.published || '').localeCompare(a.published || ''))
    .slice(0, MAX_ITEMS);

  const failed = results.flatMap((result) => (result.failed ? [result.failed] : []));

  return new Response(
    JSON.stringify({
      sources: SOURCES.map((source) => ({ id: source.id, name: source.name })),
      items,
      failed,
    }),
    { headers: CORS_HEADERS },
  );
});
