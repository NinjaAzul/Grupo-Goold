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

  const unexpectedError = err as Error & { 
    statusCode?: number;
    original?: any;
    sql?: string;
    sqlState?: string;
    sqlMessage?: string;
    parent?: any;
  };
  unexpectedError.statusCode = 500;

  const errorDetails: any = {
    errorId,
    statusCode: 500,
    path: req.path,
    method: req.method,
    message: unexpectedError.message,
    name: unexpectedError.name,
  };

  if (unexpectedError.stack) {
    errorDetails.stack = unexpectedError.stack.split('\n').slice(0, 20).join('\n');
  }

  const sequelizeError = unexpectedError.original || unexpectedError.parent;
  if (sequelizeError) {
    errorDetails.sequelize = {
      message: sequelizeError.message,
      code: sequelizeError.code,
      errno: sequelizeError.errno,
      sqlState: sequelizeError.sqlState,
      sqlMessage: sequelizeError.sqlMessage,
      sql: sequelizeError.sql ? sequelizeError.sql.substring(0, 500) : undefined,
    };
  }

  if (unexpectedError.sql) {
    errorDetails.sql = unexpectedError.sql.substring(0, 500);
  }
  if (unexpectedError.sqlState) {
    errorDetails.sqlState = unexpectedError.sqlState;
  }
  if (unexpectedError.sqlMessage) {
    errorDetails.sqlMessage = unexpectedError.sqlMessage;
  }

  console.error('[ERROR - Full Details]', JSON.stringify(errorDetails, null, 2));
  
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
