import { env } from '../config/env.js';
import { contentCleaner } from '../extractors/content-cleaner.js';
import { TokenGuard, TokenGuardResult } from '../extractors/token-guard.js';
import { logger } from '../utils/logger.js';

export interface ExtractedPage {
  url: string;
  title: string;
  siteName: string | null;
  markdown: string;
  excerpt: string;
  byline: string | null;
  tokenCount: number;
  originalTokenCount: number;
  truncated: boolean;
  error?: string;
}

export class ExtractorService {
  private timeoutMs: number;

  constructor() {
    this.timeoutMs = env.FETCH_TIMEOUT_MS;
  }

  /**
   * Fetches an external webpage, cleans HTML boilerplate,
   * converts to Markdown, and enforces token budget.
   */
  async fetchPage(url: string, maxTokens: number = env.DEFAULT_MAX_TOKENS_PER_PAGE): Promise<ExtractedPage> {
    const validatedTokens = Math.min(
      Math.max(100, maxTokens),
      env.MAX_ALLOWED_TOKENS_PER_PAGE
    );

    try {
      logger.debug('Fetching webpage', { url, maxTokens: validatedTokens });

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
          'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"macOS"',
          'Upgrade-Insecure-Requests': '1',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('text/html') && !contentType.includes('text/plain') && !contentType.includes('application/xhtml+xml')) {
        throw new Error(`Unsupported content type: ${contentType}`);
      }

      // Safeguard: abort if Content-Length exceeds 4MB
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength, 10) > 4 * 1024 * 1024) {
        throw new Error(`Page size too large (${Math.round(parseInt(contentLength, 10) / 1024 / 1024)}MB)`);
      }

      const html = await response.text();
      const cleaned = contentCleaner.clean(html, response.url || url);
      const tokenResult: TokenGuardResult = TokenGuard.truncate(cleaned.markdown, validatedTokens);

      logger.info('Page successfully extracted and cleaned', {
        url,
        title: cleaned.title,
        originalTokens: tokenResult.originalTokenCount,
        finalTokens: tokenResult.tokenCount,
        truncated: tokenResult.truncated,
      });

      return {
        url: response.url || url,
        title: cleaned.title,
        siteName: cleaned.siteName,
        markdown: tokenResult.text,
        excerpt: cleaned.excerpt,
        byline: cleaned.byline,
        tokenCount: tokenResult.tokenCount,
        originalTokenCount: tokenResult.originalTokenCount,
        truncated: tokenResult.truncated,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.warn('Failed to extract webpage content', { url, error: errorMessage });

      return {
        url,
        title: 'Error de extracción',
        siteName: null,
        markdown: `> ⚠️ **No fue posible extraer el contenido de esta página.**\n> **Causa:** ${errorMessage}`,
        excerpt: '',
        byline: null,
        tokenCount: 0,
        originalTokenCount: 0,
        truncated: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Fetches multiple URLs concurrently with error isolation.
   */
  async fetchPagesParallel(
    urls: string[],
    maxTokensPerPage: number = env.DEFAULT_MAX_TOKENS_PER_PAGE
  ): Promise<ExtractedPage[]> {
    logger.info('Executing parallel page extraction', { urlCount: urls.length, maxTokensPerPage });

    const fetchPromises = urls.map((url) => this.fetchPage(url, maxTokensPerPage));
    const results = await Promise.all(fetchPromises);

    return results;
  }
}

export const extractorService = new ExtractorService();
