import { Router } from 'express';
import { SeedController } from './seed.controller';
import { validateApiKey } from '@shared/middlewares';

const router = Router();
const seedController = new SeedController();

/**
 * @swagger
 * /database/seed:
 *   post:
 *     summary: Execute database seeds (API Key required)
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
 *         description: Seeds executed successfully
 *       401:
 *         description: Unauthorized - Invalid API key
 *       500:
 *         description: Error executing seeds
 */
router.post(
  '/',
  validateApiKey,
  seedController.handle.bind(seedController)
);

export { router as seedApiKeyRoutes };
