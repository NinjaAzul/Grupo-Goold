import 'reflect-metadata';
import 'dotenv/config';
import { app } from './app';
import { sequelize } from '@shared/config';
import { logger } from '@shared/utils';
import { validateEnvironment } from '@shared/environments';
import {
  generateErrorId,
  formatErrorForLog,
} from '@shared/utils/error-formatter';

import './database/models';

process.on(
  'unhandledRejection',
  (reason: unknown, _promise: Promise<unknown>) => {
    const errorId = generateErrorId();
    const error =
      reason instanceof Error
        ? reason
        : new Error(String(reason || 'Unhandled Rejection'));

    const formattedLog = formatErrorForLog(error, {
      errorId,
      path: 'process',
      method: 'unhandledRejection',
    });

    logger.error('[Unhandled Rejection]', formattedLog);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
);

process.on('uncaughtException', (error: Error) => {
  const errorId = generateErrorId();

  const formattedLog = formatErrorForLog(error, {
    errorId,
    path: 'process',
    method: 'uncaughtException',
  });

  logger.error('[Uncaught Exception]', formattedLog);

  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

async function startServer() {
  try {
    await validateEnvironment();

    const PORT = process.env.PORT || 3001;

    await sequelize.authenticate();
    logger.info('Database connection established successfully.');

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    const errorId = generateErrorId();
    const serverError =
      error instanceof Error
        ? error
        : new Error(String(error || 'Failed to start server'));

    const formattedLog = formatErrorForLog(serverError, {
      errorId,
      path: 'server',
      method: 'startServer',
    });

    logger.error('Failed to start server', formattedLog);
    process.exit(1);
  }
}

startServer();
