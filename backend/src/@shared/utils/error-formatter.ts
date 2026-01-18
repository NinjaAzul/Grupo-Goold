import { randomUUID } from 'crypto';

export interface ErrorLogContext {
  path?: string;
  method?: string;
  errorId?: string;
  statusCode?: number;
}

export interface FormattedErrorLog {
  timestamp: string;
  level: 'error' | 'warn' | 'info';
  message: string;
  errorId?: string;
  statusCode?: number;
  path?: string;
  method?: string;
  stack?: string;
  [key: string]: unknown;
}

export function generateErrorId(): string {
  return randomUUID();
}

export function filterStack(stack: string | undefined): string | undefined {
  if (!stack) return undefined;

  const isProduction = process.env.NODE_ENV === 'production';

  const lines = stack.split('\n');

  if (isProduction) {
    return undefined;
  }

  const filtered = lines.filter((line) => {
    const trimmed = line.trim();

    return (
      trimmed.startsWith('at ') &&
      !trimmed.includes('node_modules') &&
      !trimmed.includes('internal/')
    );
  });

  if (filtered.length === 0) {
    return undefined;
  }

  return filtered.slice(0, 10).join('\n');
}

export function formatErrorForLog(
  error: Error,
  context?: ErrorLogContext
): FormattedErrorLog {
  const isProduction = process.env.NODE_ENV === 'production';
  const errorId = context?.errorId || generateErrorId();

  const formatted: FormattedErrorLog = {
    timestamp: new Date().toISOString(),
    level: 'error',
    message: error.message || 'Unknown error',
    errorId,
  };

  if (context?.statusCode) {
    formatted.statusCode = context.statusCode;
  }

  if (context?.path) {
    formatted.path = context.path;
  }

  if (context?.method) {
    formatted.method = context.method;
  }

  if (!isProduction && error.stack) {
    formatted.stack = filterStack(error.stack);
  }

  return formatted;
}

export function formatErrorForResponse(
  error: Error & { statusCode?: number; name?: string },
  errorId: string,
  isProduction: boolean
): {
  error: {
    message: string;
    statusCode: number;
    name: string;
    errorId?: string;
  };
} {
  const statusCode = error.statusCode || 500;
  const name = error.name || 'Error';

  const response: {
    error: {
      message: string;
      statusCode: number;
      name: string;
      errorId?: string;
    };
  } = {
    error: {
      message: isProduction
        ? 'Erro interno do servidor'
        : error.message || 'Erro interno do servidor',
      statusCode,
      name,
    },
  };

  if (!isProduction) {
    response.error.errorId = errorId;
  }

  return response;
}
