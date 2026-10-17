import { env } from '../config/env.js';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private currentLevelPriority: number;

  constructor() {
    this.currentLevelPriority = LOG_LEVEL_PRIORITY[env.LOG_LEVEL];
  }

  private formatMessage(level: LogLevel, message: string, meta?: unknown): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `${prefix} ${message}${metaStr}`;
  }

  debug(message: string, meta?: unknown): void {
    if (this.currentLevelPriority <= LOG_LEVEL_PRIORITY.debug) {
      process.stderr.write(`${this.formatMessage('debug', message, meta)}\n`);
    }
  }

  info(message: string, meta?: unknown): void {
    if (this.currentLevelPriority <= LOG_LEVEL_PRIORITY.info) {
      process.stderr.write(`${this.formatMessage('info', message, meta)}\n`);
    }
  }

  warn(message: string, meta?: unknown): void {
    if (this.currentLevelPriority <= LOG_LEVEL_PRIORITY.warn) {
      process.stderr.write(`${this.formatMessage('warn', message, meta)}\n`);
    }
  }

  error(message: string, meta?: unknown): void {
    if (this.currentLevelPriority <= LOG_LEVEL_PRIORITY.error) {
      process.stderr.write(`${this.formatMessage('error', message, meta)}\n`);
    }
  }
}

export const logger = new Logger();
