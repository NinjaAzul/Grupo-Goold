import { Request, Response } from 'express';
import { NOT_FOUND } from '../errors';

export const notFoundHandler = (req: Request, res: Response): Response => {
  return res.status(404).json({
    error: {
      message: 'Route not found',
      statusCode: 404,
      name: NOT_FOUND,
    },
  });
};
