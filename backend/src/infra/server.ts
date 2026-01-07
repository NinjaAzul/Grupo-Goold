import 'dotenv/config';
import { app } from './app';
import { sequelize } from '@shared/config';
import { logger } from '@shared/utils';

// Importar models para registrar relacionamentos
import './database/models';

const PORT = process.env.PORT || 3001;

sequelize
  .authenticate()
  .then(() => {
    logger.info('Database connection established successfully.');
  })
  .catch((error) => {
    logger.error('Unable to connect to the database:', error);
  });

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
