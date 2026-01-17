import { Router } from 'express';
import { UpdateStatusController } from './update-status.controller';
import {
  ensureAuthenticated,
  ensureAdmin,
  validationMiddleware,
} from '@shared/middlewares';
import { UpdateStatusDto } from './update-status.dto';

const router = Router();
const updateStatusController = new UpdateStatusController();

/**
 * @swagger
 * /admin/appointments/{id}/status:
 *   patch:
 *     summary: Update appointment status (Admin only)
 *     tags: [Admin - Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, scheduled, cancelled]
 *                 description: New status
 *     responses:
 *       200:
 *         description: Appointment status updated
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Appointment not found
 */
router.patch(
  '/:id/status',
  ensureAuthenticated,
  ensureAdmin,
  validationMiddleware(UpdateStatusDto),
  updateStatusController.handle.bind(updateStatusController)
);

export { router as updateStatusRoutes };
