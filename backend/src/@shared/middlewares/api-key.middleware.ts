import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@shared/errors';

/**
 * Middleware to validate API key from header or query parameter
 * Used for administrative operations that need to run before authentication is available
 */
export function validateApiKey(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  const expectedApiKey = process.env.ADMIN_API_KEY;

  if (!expectedApiKey) {
    return next(
      new UnauthorizedError(
        'API key authentication is not configured. Please set ADMIN_API_KEY environment variable.'
      )
    );
  }

  if (!apiKey || apiKey !== expectedApiKey) {
    return next(new UnauthorizedError('Invalid API key'));
  }

  next();
}
