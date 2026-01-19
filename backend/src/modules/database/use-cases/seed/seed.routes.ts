import { Router } from 'express';
import { SeedController } from './seed.controller';
import { ensureAuthenticated, ensureAdmin } from '@shared/middlewares';

const router = Router();
const seedController = new SeedController();

/**
 * @swagger
 * /admin/database/seed:
 *   post:
 *     summary: Execute database seeds (Admin only)
 *     tags: [Admin - Database]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Seeds executed successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error executing seeds
 */
router.post(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  seedController.handle.bind(seedController)
);

export { router as seedRoutes };
