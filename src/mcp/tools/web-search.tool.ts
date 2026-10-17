import { z } from 'zod';
import { searxngService } from '../../services/searxng.service.js';
import { env } from '../../config/env.js';

export const webSearchInputSchema = {
  type: 'object' as const,
  properties: {
    query: {
      type: 'string',
      description: 'The search query string to find information on the web.',
    },
    max_results: {
      type: 'number',
      description: `Maximum number of search results to return (default: ${env.DEFAULT_MAX_RESULTS}, max: 20).`,
    },
  },
  required: ['query'],
};

export const webSearchZodSchema = z.object({
  query: z.string().min(1, 'La consulta de búsqueda no puede estar vacía'),
  max_results: z.coerce.number().int().min(1).max(20).optional().default(env.DEFAULT_MAX_RESULTS),
});

export type WebSearchArgs = z.infer<typeof webSearchZodSchema>;

export async function handleWebSearch(rawArgs: unknown) {
  const args = webSearchZodSchema.parse(rawArgs);
  const results = await searxngService.search(args.query, args.max_results);

  if (results.length === 0) {
    return {
      content: [
        {
          type: 'text' as const,
          text: `No se encontraron resultados en la web para la consulta: "${args.query}".`,
        },
      ],
    };
  }

  // Format response for optimal LLM context consumption
  let outputMarkdown = `## Resultados de búsqueda web para: "${args.query}"\n\n`;

  results.forEach((item, index) => {
    outputMarkdown += `### ${index + 1}. [${item.title}](${item.url})\n`;
    outputMarkdown += `**URL:** ${item.url}\n`;
    outputMarkdown += `**Extracto:** ${item.content || 'Sin snippet disponible.'}\n\n`;
  });

  return {
    content: [
      {
        type: 'text' as const,
        text: outputMarkdown.trim(),
      },
    ],
  };
}
