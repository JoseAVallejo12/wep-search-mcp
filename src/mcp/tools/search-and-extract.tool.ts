import { z } from 'zod';
import { searxngService } from '../../services/searxng.service.js';
import { extractorService } from '../../services/extractor.service.js';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

export const searchAndExtractInputSchema = {
  type: 'object' as const,
  properties: {
    query: {
      type: 'string',
      description: 'The search query to find and extract relevant web content.',
    },
    max_results: {
      type: 'number',
      description: 'Number of top search results to extract content from (default: 3, max: 10).',
    },
    max_tokens_per_page: {
      type: 'number',
      description: `Maximum tokens of extracted content to return per page (default: ${env.DEFAULT_MAX_TOKENS_PER_PAGE}, range: 200-${env.MAX_ALLOWED_TOKENS_PER_PAGE}).`,
    },
  },
  required: ['query'],
};

export const searchAndExtractZodSchema = z.object({
  query: z.string().min(1, 'La consulta de búsqueda no puede estar vacía'),
  max_results: z.coerce.number().int().min(1).max(10).optional().default(3),
  max_tokens_per_page: z.coerce
    .number()
    .int()
    .min(200)
    .max(env.MAX_ALLOWED_TOKENS_PER_PAGE)
    .optional()
    .default(env.DEFAULT_MAX_TOKENS_PER_PAGE),
});

export type SearchAndExtractArgs = z.infer<typeof searchAndExtractZodSchema>;

export async function handleSearchAndExtract(rawArgs: unknown) {
  const args = searchAndExtractZodSchema.parse(rawArgs);

  logger.info('Executing search_and_extract pipeline', {
    query: args.query,
    max_results: args.max_results,
    max_tokens_per_page: args.max_tokens_per_page,
  });

  // Step 1: Query SearXNG for the best candidate URLs
  const searchResults = await searxngService.search(args.query, args.max_results);

  if (searchResults.length === 0) {
    return {
      content: [
        {
          type: 'text' as const,
          text: `No se encontraron resultados web para la consulta: "${args.query}".`,
        },
      ],
    };
  }

  // Step 2: Extract content in parallel for all candidate URLs
  const urls = searchResults.map((r) => r.url);
  const extractedPages = await extractorService.fetchPagesParallel(urls, args.max_tokens_per_page);

  // Step 3: Construct the synthesized Markdown report for single-turn LLM synthesis
  let report = `# Reporte de Búsqueda y Extracción Web\n\n`;
  report += `**Consulta de Búsqueda:** "${args.query}"\n`;
  report += `**Fuentes consultadas:** ${extractedPages.length}\n\n`;

  report += `## Resumen de Fuentes Encontradas\n\n`;
  searchResults.forEach((res, idx) => {
    report += `${idx + 1}. **[${res.title}](${res.url})**\n`;
    report += `   - *Snippet:* ${res.content || 'Sin descripción'}\n`;
  });

  report += `\n---\n\n## Contenido Detallado de Fuentes\n\n`;

  extractedPages.forEach((page, idx) => {
    report += `### Fuente ${idx + 1}: ${page.title}\n`;
    report += `- **URL:** ${page.url}\n`;
    if (page.siteName) report += `- **Dominio:** ${page.siteName}\n`;
    report += `- **Tokens:** ${page.tokenCount}${page.truncated ? ' (Truncado al límite)' : ''}\n\n`;
    report += `${page.markdown}\n\n`;
    report += `---\n\n`;
  });

  return {
    content: [
      {
        type: 'text' as const,
        text: report.trim(),
      },
    ],
  };
}
