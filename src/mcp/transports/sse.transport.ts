import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { createMcpServer } from '../server.js';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { renderLandingPage } from '../../views/landing.page.js';

interface ActiveSession {
  transport: SSEServerTransport;
  server: Server;
  createdAt: Date;
}

export async function startSseTransport(): Promise<void> {
  const app = express();

  // Basic middlewares
  app.use(cors());
  app.use(express.json({ limit: '4mb' }));

  // Serve static assets from built React application (view/dist)
  const viewDistPath = path.resolve(process.cwd(), 'view/dist');
  if (fs.existsSync(viewDistPath)) {
    app.use(express.static(viewDistPath, { index: false }));
    logger.info(`Serving static React frontend from ${viewDistPath}`);
  }

  const sessions = new Map<string, ActiveSession>();

  // Health check endpoint for Docker / orchestration
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      activeSessions: sessions.size,
      timestamp: new Date().toISOString(),
    });
  });

  // Root endpoint: Serves React SPA for browsers, JSON metadata for API clients
  app.get('/', (req: Request, res: Response) => {
    // Return JSON if client explicitly asks for application/json or query parameter ?format=json
    const acceptsJson = req.headers.accept && req.headers.accept.includes('application/json') && !req.headers.accept.includes('text/html');
    if (req.query.format === 'json' || acceptsJson) {
      res.status(200).json({
        name: 'web-search-mcp',
        description: 'Optimized Web Search & Content Extraction MCP Server for LLMs',
        version: '1.0.0',
        transport: 'sse',
        endpoints: {
          sse: '/sse',
          messages: '/messages',
          health: '/health',
        },
        tools: ['web_search', 'web_fetch', 'search_and_extract'],
        activeSessions: sessions.size,
      });
      return;
    }

    // Serve React index.html if available
    const indexHtmlPath = path.join(viewDistPath, 'index.html');
    if (fs.existsSync(indexHtmlPath)) {
      res.sendFile(indexHtmlPath);
      return;
    }

    // Fallback: SSR landing page if view/dist was not built
    const host = req.get('host') || 'mcp-search-engine-production.up.railway.app';
    const isHttps = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https';
    const protocol = isHttps ? 'https' : 'http';

    const html = renderLandingPage({
      activeSessions: sessions.size,
      uptime: process.uptime(),
      host,
      protocol,
    });

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  });

  // SSE connection endpoint
  app.get('/sse', async (_req: Request, res: Response) => {
    logger.info('Incoming SSE connection request');

    try {
      const transport = new SSEServerTransport('/messages', res);
      const server = createMcpServer();

      sessions.set(transport.sessionId, {
        transport,
        server,
        createdAt: new Date(),
      });

      logger.info(`SSE session established: ${transport.sessionId} (Total active: ${sessions.size})`);

      res.on('close', async () => {
        logger.info(`SSE session closed: ${transport.sessionId}`);
        sessions.delete(transport.sessionId);
        try {
          await server.close();
        } catch (err) {
          logger.warn(`Error closing MCP server for session ${transport.sessionId}`, { err });
        }
      });

      await server.connect(transport);
    } catch (error) {
      logger.error('Failed to initialize SSE connection', { error });
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to establish SSE connection' });
      }
    }
  });

  // Message receiver endpoint
  app.post('/messages', async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;

    if (!sessionId) {
      res.status(400).send('Missing sessionId query parameter');
      return;
    }

    const session = sessions.get(sessionId);
    if (!session) {
      logger.warn(`Received message for unknown or expired session: ${sessionId}`);
      res.status(404).send('Session not found or expired');
      return;
    }

    try {
      await session.transport.handlePostMessage(req, res, req.body);
    } catch (error) {
      logger.error(`Error handling message for session ${sessionId}`, { error });
      if (!res.headersSent) {
        res.status(500).send('Internal server error while processing message');
      }
    }
  });

  // Start HTTP listening
  const server = app.listen(env.PORT, env.HOST, () => {
    logger.info(`🚀 Web Search MCP Server (SSE) listening on http://${env.HOST}:${env.PORT}`);
    logger.info(`   - SSE Endpoint:     http://${env.HOST}:${env.PORT}/sse`);
    logger.info(`   - Messages Endpoint: http://${env.HOST}:${env.PORT}/messages`);
    logger.info(`   - Health Endpoint:   http://${env.HOST}:${env.PORT}/health`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    logger.info('Shutting down HTTP/SSE server...');
    for (const [id, session] of sessions.entries()) {
      try {
        await session.server.close();
      } catch (err) {
        logger.warn(`Error closing session ${id} during shutdown`, { err });
      }
    }
    sessions.clear();

    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
