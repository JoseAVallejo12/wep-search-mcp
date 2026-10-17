import { Readability } from '@mozilla/readability';
import { parseHTML } from 'linkedom';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { logger } from '../utils/logger.js';

export interface CleanedContent {
  title: string;
  excerpt: string;
  byline: string | null;
  siteName: string | null;
  markdown: string;
  textContent: string;
}

export class ContentCleaner {
  private turndown: TurndownService;

  constructor() {
    this.turndown = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
      emDelimiter: '_',
    });

    // Apply GitHub Flavored Markdown (tables, strikethrough, etc.)
    this.turndown.use(gfm);

    // Custom rule: Strip or simplify images, specifically removing heavy base64 data URIs
    this.turndown.addRule('cleanImages', {
      filter: 'img',
      replacement: (_content, node) => {
        const element = node as HTMLImageElement;
        const alt = element.getAttribute('alt') || 'Imagen';
        const src = element.getAttribute('src') || '';

        // Discard data: base64 images to avoid token blow-up
        if (src.startsWith('data:')) {
          return `[${alt}]`;
        }

        return src ? `![${alt}](${src})` : `[${alt}]`;
      },
    });

    // Custom rule: Clean empty links or javascript: links
    this.turndown.addRule('cleanLinks', {
      filter: (node) => {
        if (node.nodeName === 'A') {
          const href = (node as HTMLAnchorElement).getAttribute('href');
          return !href || href.startsWith('javascript:') || href === '#';
        }
        return false;
      },
      replacement: (content) => content,
    });
  }

  /**
   * Cleans an HTML string, extracts the primary readable content,
   * and converts it into structured Markdown.
   */
  clean(html: string, originalUrl?: string): CleanedContent {
    try {
      const { document } = parseHTML(html);

      // Pre-clean noisy DOM elements that Readability might sometimes include
      const noisySelectors = [
        'script',
        'style',
        'noscript',
        'iframe',
        'form',
        'svg',
        'canvas',
        'dialog',
        '.ad',
        '.ads',
        '.advertisement',
        '.cookie-banner',
        '.newsletter-signup',
      ];

      for (const selector of noisySelectors) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
          el.remove();
        }
      }

      // Extract metadata from <meta> tags if available
      const metaTitle =
        document.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
        document.querySelector('title')?.textContent?.trim() ||
        '';

      const metaDescription =
        document.querySelector('meta[name="description"]')?.getAttribute('content') ||
        document.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
        '';

      const metaSiteName =
        document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ||
        (originalUrl ? new URL(originalUrl).hostname : null);

      // Run Mozilla Readability
      const reader = new Readability(document, {
        charThreshold: 50,
      });

      const parsed = reader.parse();

      let title = metaTitle;
      let excerpt = metaDescription;
      let byline = null;
      let siteName = metaSiteName;
      let htmlToConvert = '';
      let textContent = '';

      if (parsed && parsed.content) {
        title = parsed.title || metaTitle || 'Sin título';
        excerpt = parsed.excerpt || metaDescription;
        byline = parsed.byline;
        siteName = parsed.siteName || metaSiteName;
        htmlToConvert = parsed.content;
        textContent = parsed.textContent || '';
      } else {
        // Fallback for non-article pages (e.g., listings, landing pages, docs)
        logger.debug('Readability did not find an article; using body fallback', { originalUrl });
        const bodyElement = (document.querySelector('main') || document.querySelector('body') || document.documentElement) as HTMLElement | null;
        htmlToConvert = bodyElement ? bodyElement.innerHTML : html;
        textContent = bodyElement?.textContent || '';
      }

      // Convert clean HTML to Markdown
      let markdown = this.turndown.turndown(htmlToConvert);

      // Post-process Markdown: remove excessive empty lines
      markdown = markdown
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]+$/gm, '')
        .trim();

      return {
        title,
        excerpt,
        byline: byline ?? null,
        siteName: siteName ?? null,
        markdown,
        textContent: textContent.trim(),
      };
    } catch (error) {
      logger.error('Failed to clean HTML content', { error, originalUrl });
      return {
        title: originalUrl || 'Página web',
        excerpt: '',
        byline: null,
        siteName: originalUrl ? new URL(originalUrl).hostname : null,
        markdown: html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim(),
        textContent: html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim(),
      };
    }
  }
}

export const contentCleaner = new ContentCleaner();
