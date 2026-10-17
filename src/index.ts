import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { startStdioTransport } from './mcp/transports/stdio.transport.js';
import { startSseTransport } from './mcp/transports/sse.transport.js';

async function main() {
  logger.info('Initializing Web Search MCP Server', {
    transport: env.MCP_TRANSPORT,
    searxngUrl: env.SEARXNG_URL,
    nodeEnv: env.NODE_ENV,
  });

  try {
    if (env.MCP_TRANSPORT === 'stdio') {
      await startStdioTransport();
    } else {
      await startSseTransport();
    }
  } catch (error) {
    logger.error('Fatal initialization error in MCP server', { error });
    process.exit(1);
  }
}

main();
