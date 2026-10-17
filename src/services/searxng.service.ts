import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export interface SearchResult {
  title: string;
  url: string;
  content: string;
  engine?: string;
  score?: number;
}

export interface SearXNGResponse {
  query: string;
  number_of_results?: number;
  results?: Array<{
    url: string;
    title: string;
    content?: string;
    engine?: string;
    score?: number;
    publishedDate?: string;
  }>;
  unresponsive_engines?: Array<[string, string]>;
}

export class SearXNGService {
  private baseUrl: string;
  private timeoutMs: number;

  constructor() {
    this.baseUrl = env.SEARXNG_URL.replace(/\/+$/, '');
    this.timeoutMs = env.SEARXNG_TIMEOUT_MS;
  }

  /**
   * Performs a web search through the SearXNG instance.
   * Deduplicates domains to ensure diverse, high-quality results.
   */
  async search(query: string, maxResults: number = env.DEFAULT_MAX_RESULTS): Promise<SearchResult[]> {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query cannot be empty.');
    }

    const searchUrl = new URL(`${this.baseUrl}/search`);
    searchUrl.searchParams.set('q', query.trim());
    searchUrl.searchParams.set('format', 'json');
    searchUrl.searchParams.set('categories', 'general');

    logger.debug('Executing SearXNG query', { query, searchUrl: searchUrl.toString() });

    try {
      const response = await fetch(searchUrl.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'WebSearchMCP/1.0 (+https://github.com/mcp-search-engine)',
        },
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (!response.ok) {
        throw new Error(`SearXNG responded with HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as SearXNGResponse;

      if (!data.results || !Array.isArray(data.results)) {
        logger.warn('SearXNG returned no results array', { data });
        return [];
      }

      const filteredResults = this.filterAndDeduplicate(data.results, maxResults);
      logger.info('SearXNG search completed', {
        query,
        rawCount: data.results.length,
        returnedCount: filteredResults.length,
      });

      return filteredResults;
    } catch (error) {
      logger.error('Failed to query SearXNG', {
        error: error instanceof Error ? error.message : String(error),
        query,
      });
      throw new Error(`SearXNG search error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Deduplicates results by domain, cleans snippets, and limits count.
   */
  private filterAndDeduplicate(
    rawResults: NonNullable<SearXNGResponse['results']>,
    maxResults: number
  ): SearchResult[] {
    const seenDomains = new Set<string>();
    const results: SearchResult[] = [];

    for (const item of rawResults) {
      if (!item.url || !item.title) continue;

      try {
        const parsedUrl = new URL(item.url);
        // Only accept http and https protocols
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) continue;

        const hostname = parsedUrl.hostname.toLowerCase();

        // Avoid multiple results from the exact same domain for higher result diversity
        if (seenDomains.has(hostname)) {
          continue;
        }

        seenDomains.add(hostname);

        const cleanSnippet = (item.content || '')
          .replace(/<[^>]*>?/gm, '')
          .replace(/\s+/g, ' ')
          .trim();

        results.push({
          title: item.title.trim(),
          url: item.url,
          content: cleanSnippet,
          engine: item.engine,
          score: item.score,
        });

        if (results.length >= maxResults) {
          break;
        }
      } catch {
        // Skip invalid URL
        continue;
      }
    }

    return results;
  }
}

export const searxngService = new SearXNGService();
