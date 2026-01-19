import { Router } from 'express';
import { MigrateController } from './migrate.controller';
import { validateApiKey } from '@shared/middlewares';

const router = Router();
const migrateController = new MigrateController();

/**
 * @swagger
 * /database/migrate:
 *   post:
 *     summary: Execute database migrations (API Key required)
 *     tags: [Database]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: Admin API key
 *     responses:
 *       200:
 *         description: Migrations executed successfully
 *       401:
 *         description: Unauthorized - Invalid API key
 *       500:
 *         description: Error executing migrations
 */
router.post(
  '/',
  validateApiKey,
  migrateController.handle.bind(migrateController)
);

export { router as migrateApiKeyRoutes };
