import { Router } from 'express';
import { MigrateController } from './migrate.controller';
import { ensureAuthenticated, ensureAdmin } from '@shared/middlewares';

const router = Router();
const migrateController = new MigrateController();

/**
 * @swagger
 * /admin/database/migrate:
 *   post:
 *     summary: Execute database migrations (Admin only)
 *     tags: [Admin - Database]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Migrations executed successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error executing migrations
 */
router.post(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  migrateController.handle.bind(migrateController)
);

export { router as migrateRoutes };
