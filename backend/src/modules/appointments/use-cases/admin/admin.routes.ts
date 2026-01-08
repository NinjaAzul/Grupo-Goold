import { Router } from 'express';
import { ListAppointmentsController } from './list/list.controller';
import { UpdateStatusController } from './update-status/update-status.controller';
import { ensureAuthenticated, ensureAdmin } from '@shared/middlewares';

const adminRoutes = Router();

const listAppointmentsController = new ListAppointmentsController();
const updateStatusController = new UpdateStatusController();

/**
 * @swagger
 * /admin/appointments:
 *   get:
 *     summary: List all appointments (Admin only)
 *     tags: [Admin - Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by user name or email
 *       - in: query
 *         name: room
 *         schema:
 *           type: string
 *         description: Filter by room name
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, scheduled, cancelled]
 *         description: Filter by status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date
 *     responses:
 *       200:
 *         description: List of appointments
 *       401:
 *         description: Unauthorized
 */
adminRoutes.get(
  '/appointments',
  ensureAuthenticated,
  ensureAdmin,
  listAppointmentsController.handle.bind(listAppointmentsController)
);

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
adminRoutes.patch(
  '/appointments/:id/status',
  ensureAuthenticated,
  ensureAdmin,
  updateStatusController.handle.bind(updateStatusController)
);

export { adminRoutes };
