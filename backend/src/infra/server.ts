import 'dotenv/config';
import { app } from './app';
import { sequelize } from '@shared/config';
import { logger } from '@shared/utils';
import { validateEnvironment } from '@shared/environments';

import './database/models';

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
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
