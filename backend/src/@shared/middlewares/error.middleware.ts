import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[Error Handler]', {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
        name: err.name,
      },
    });
  }

  console.error('[Unexpected Error]', err);

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
