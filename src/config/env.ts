import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env file if available
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
  MCP_TRANSPORT: z.enum(['sse', 'stdio']).default('sse'),
  SEARXNG_URL: z.string().url().default('http://localhost:8080'),
  SEARXNG_TIMEOUT_MS: z.coerce.number().default(8000),
  FETCH_TIMEOUT_MS: z.coerce.number().default(10000),
  DEFAULT_MAX_RESULTS: z.coerce.number().default(5),
  DEFAULT_MAX_TOKENS_PER_PAGE: z.coerce.number().default(1000),
  MAX_ALLOWED_TOKENS_PER_PAGE: z.coerce.number().default(4000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export type EnvConfig = z.infer<typeof envSchema>;

function parseEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid environment configuration:', result.error.format());
    process.exit(1);
  }
  return result.data;
}

export const env = parseEnv();
