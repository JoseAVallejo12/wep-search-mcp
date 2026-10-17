import { z } from 'zod';
import { extractorService } from '../../services/extractor.service.js';
import { env } from '../../config/env.js';

export const webFetchInputSchema = {
  type: 'object' as const,
  properties: {
    url: {
      type: 'string',
      description: 'The complete HTTP/HTTPS URL of the webpage to fetch and extract.',
    },
    max_tokens: {
      type: 'number',
      description: `Maximum tokens to return for this page (default: ${env.DEFAULT_MAX_TOKENS_PER_PAGE}, range: 100-${env.MAX_ALLOWED_TOKENS_PER_PAGE}).`,
    },
  },
  required: ['url'],
};

export const webFetchZodSchema = z.object({
  url: z.string().url('Debe ser una URL válida HTTP o HTTPS'),
  max_tokens: z.coerce
    .number()
    .int()
    .min(100)
    .max(env.MAX_ALLOWED_TOKENS_PER_PAGE)
    .optional()
    .default(env.DEFAULT_MAX_TOKENS_PER_PAGE),
});

export type WebFetchArgs = z.infer<typeof webFetchZodSchema>;

export async function handleWebFetch(rawArgs: unknown) {
  const args = webFetchZodSchema.parse(rawArgs);
  const page = await extractorService.fetchPage(args.url, args.max_tokens);

  let output = `# ${page.title}\n\n`;
  output += `- **URL original:** ${page.url}\n`;
  if (page.siteName) output += `- **Sitio web:** ${page.siteName}\n`;
  if (page.byline) output += `- **Autor:** ${page.byline}\n`;
  output += `- **Tokens:** ${page.tokenCount} (Original: ${page.originalTokenCount}${page.truncated ? ' - Truncado' : ''})\n\n`;
  output += `---\n\n`;
  output += page.markdown;

  return {
    content: [
      {
        type: 'text' as const,
        text: output.trim(),
      },
    ],
  };
}
