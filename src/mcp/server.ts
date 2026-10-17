import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  webSearchInputSchema,
  handleWebSearch,
} from './tools/web-search.tool.js';
import {
  webFetchInputSchema,
  handleWebFetch,
} from './tools/web-fetch.tool.js';
import {
  searchAndExtractInputSchema,
  handleSearchAndExtract,
} from './tools/search-and-extract.tool.js';
import { logger } from '../utils/logger.js';

/**
 * Creates and configures a new MCP Server instance with all tools registered.
 * A new instance is created per transport connection to support multiple SSE clients.
 */
export function createMcpServer(): Server {
  const server = new Server(
    {
      name: 'web-search-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register tool list
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'web_search',
          description:
            'Busca en la web a través de múltiples motores (Google, Bing, DuckDuckGo, etc.) con deduplicación por dominio y snippets limpios.',
          inputSchema: webSearchInputSchema,
        },
        {
          name: 'web_fetch',
          description:
            'Extrae el contenido principal de una página web en formato Markdown limpio, eliminando anuncios, menús, scripts y ajustando el presupuesto de tokens.',
          inputSchema: webFetchInputSchema,
        },
        {
          name: 'search_and_extract',
          description:
            'Herramienta integral tipo Tavily/Jina: busca en la web y extrae en paralelo el contenido limpio en Markdown de las mejores páginas en un solo llamado optimizado para LLMs.',
          inputSchema: searchAndExtractInputSchema,
        },
      ],
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    logger.info(`MCP Tool invoked: ${name}`);

    try {
      switch (name) {
        case 'web_search':
          return await handleWebSearch(args);
        case 'web_fetch':
          return await handleWebFetch(args);
        case 'search_and_extract':
          return await handleSearchAndExtract(args);
        default:
          return {
            content: [
              {
                type: 'text',
                text: `Herramienta desconocida: "${name}".`,
              },
            ],
            isError: true,
          };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Error in tool execution: ${name}`, { error: errorMessage, args });
      return {
        content: [
          {
            type: 'text',
            text: `Error al ejecutar la herramienta "${name}": ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}
