import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
        name: err.name,
      },
    });
  }

  // Unexpected errors
  return res.status(500).json({
    error: {
      message: 'Internal Server Error',
      statusCode: 500,
      name: 'InternalServerError',
    },
  });
};
