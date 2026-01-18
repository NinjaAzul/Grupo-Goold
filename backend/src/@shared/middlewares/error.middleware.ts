import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';
import { logger } from '../utils';
import {
  generateErrorId,
  formatErrorForLog,
  formatErrorForResponse,
} from '../utils/error-formatter';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  const isProduction = process.env.NODE_ENV === 'production';
  const errorId = generateErrorId();

  if (err instanceof AppError) {
    const formattedLog = formatErrorForLog(err, {
      errorId,
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
    });

    logger.error('[AppError Handler]', formattedLog);

    const response = formatErrorForResponse(err, errorId, isProduction);

    return res.status(err.statusCode).json(response);
  }

  const unexpectedError = err as Error & { statusCode?: number };
  unexpectedError.statusCode = 500;

  const formattedLog = formatErrorForLog(unexpectedError, {
    errorId,
    statusCode: 500,
    path: req.path,
    method: req.method,
  });

  logger.error('[Unexpected Error]', formattedLog);

  const response = formatErrorForResponse(
    unexpectedError,
    errorId,
    isProduction
  );

  return res.status(500).json(response);
};
