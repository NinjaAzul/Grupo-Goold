import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';
import { logger } from '../utils';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  if (err instanceof AppError) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('[AppError Handler]', {
        message: err.message,
        statusCode: err.statusCode,
        name: err.name,
        stack: err.stack,
      });
    }

    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
        name: err.name,
      },
    });
  }

  logger.error('[Unexpected Error]', err);

  return res.status(500).json({
    error: {
      message:
        process.env.NODE_ENV === 'production'
          ? 'Internal Server Error'
          : err.message,
      statusCode: 500,
      name: 'InternalServerError',
    },
  });
};
