import { formatErrorForLog } from './error-formatter';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  [key: string]: unknown;
}

function formatLog(entry: LogEntry): string {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    return JSON.stringify(entry);
  }

  const level = entry.level.toUpperCase().padEnd(5);
  const timestamp = entry.timestamp;
  const message = entry.message;
  const extras = Object.keys(entry)
    .filter((key) => !['timestamp', 'level', 'message'].includes(key))
    .map((key) => `${key}=${JSON.stringify(entry[key])}`)
    .join(' ');

  return `[${level}] ${timestamp} - ${message}${extras ? ` ${extras}` : ''}`;
}

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
    };

    if (args.length > 0) {
      args.forEach((arg, index) => {
        if (typeof arg === 'object' && arg !== null) {
          Object.assign(entry, arg);
        } else {
          entry[`arg${index}`] = arg;
        }
      });
    }

    console.log(formatLog(entry));
  },

  error: (message: string, error?: Error | unknown, ...args: unknown[]) => {
    if (
      error &&
      typeof error === 'object' &&
      'level' in error &&
      'errorId' in error
    ) {
      console.error(formatLog(error as unknown as LogEntry));
      return;
    }

    if (error instanceof Error) {
      const formatted = formatErrorForLog(error);

      if (
        message &&
        message !== '[AppError Handler]' &&
        message !== '[Unexpected Error]'
      ) {
        formatted.message = `${message}: ${formatted.message}`;
      }
      console.error(formatLog(formatted as unknown as LogEntry));
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
    };

    if (error) {
      entry.error = error;
    }

    if (args.length > 0) {
      args.forEach((arg, index) => {
        if (typeof arg === 'object' && arg !== null) {
          Object.assign(entry, arg);
        } else {
          entry[`arg${index}`] = arg;
        }
      });
    }

    console.error(formatLog(entry));
  },

  warn: (message: string, ...args: unknown[]) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
    };

    if (args.length > 0) {
      args.forEach((arg, index) => {
        if (typeof arg === 'object' && arg !== null) {
          Object.assign(entry, arg);
        } else {
          entry[`arg${index}`] = arg;
        }
      });
    }

    console.warn(formatLog(entry));
  },

  debug: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: 'debug',
        message,
      };

      if (args.length > 0) {
        args.forEach((arg, index) => {
          if (typeof arg === 'object' && arg !== null) {
            Object.assign(entry, arg);
          } else {
            entry[`arg${index}`] = arg;
          }
        });
      }

      console.log(formatLog(entry));
    }
  },
};
