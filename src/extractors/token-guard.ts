import { encode, decode, countTokens } from 'gpt-tokenizer';
import { logger } from '../utils/logger.js';

export interface TokenGuardResult {
  text: string;
  tokenCount: number;
  originalTokenCount: number;
  truncated: boolean;
}

export class TokenGuard {
  /**
   * Count exact tokens for a given string using cl100k_base tokenizer.
   */
  static count(text: string): number {
    if (!text || text.trim().length === 0) {
      return 0;
    }
    try {
      return countTokens(text);
    } catch (err) {
      logger.warn('Token counting fallback used due to error', { err });
      // Heuristic fallback: ~4 characters per token
      return Math.ceil(text.length / 4);
    }
  }

  /**
   * Enforce a token budget on markdown / text content.
   * If content exceeds maxTokens, truncates precisely at token boundary
   * and appends a clean truncation indicator.
   */
  static truncate(text: string, maxTokens: number): TokenGuardResult {
    if (!text || text.trim().length === 0) {
      return {
        text: '',
        tokenCount: 0,
        originalTokenCount: 0,
        truncated: false,
      };
    }

    try {
      const tokens = encode(text);
      const originalTokenCount = tokens.length;

      if (tokens.length <= maxTokens) {
        return {
          text,
          tokenCount: originalTokenCount,
          originalTokenCount,
          truncated: false,
        };
      }

      const notice = '\n\n... [Truncado]';
      const noticeTokens = encode(notice).length;
      
      const allowedContentTokens = maxTokens > noticeTokens ? maxTokens - noticeTokens : maxTokens;
      const truncatedTokens = tokens.slice(0, Math.max(1, allowedContentTokens));
      const truncatedText = decode(truncatedTokens) + (maxTokens > noticeTokens ? notice : '');

      return {
        text: truncatedText,
        tokenCount: encode(truncatedText).length,
        originalTokenCount,
        truncated: true,
      };
    } catch (err) {
      logger.error('Error during token truncation, using character fallback', { err });
      const charLimit = maxTokens * 4;
      if (text.length > charLimit) {
        return {
          text: text.slice(0, charLimit) + '\n\n... [Contenido truncado]',
          tokenCount: maxTokens,
          originalTokenCount: Math.ceil(text.length / 4),
          truncated: true,
        };
      }
      return {
        text,
        tokenCount: Math.ceil(text.length / 4),
        originalTokenCount: Math.ceil(text.length / 4),
        truncated: false,
      };
    }
  }
}
