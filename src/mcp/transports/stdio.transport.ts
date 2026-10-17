import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from '../server.js';
import { logger } from '../../utils/logger.js';

/**
 * Starts the MCP Server over stdio for local integrations
 * (e.g., Claude Desktop, Cursor, local agent CLI).
 */
export async function startStdioTransport(): Promise<void> {
  logger.info('Starting MCP Server in stdio mode...');

  const server = createMcpServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  logger.info('MCP Server stdio transport connected and listening.');

  const shutdown = async () => {
    logger.info('Shutting down stdio transport...');
    await server.close();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
