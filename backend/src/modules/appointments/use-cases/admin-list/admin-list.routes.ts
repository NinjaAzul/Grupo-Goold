import { Router } from 'express';
import { AdminListAppointmentsController } from './admin-list.controller';
import {
  ensureAuthenticated,
  ensureAdmin,
  queryValidationMiddleware,
} from '@shared/middlewares';
import { AdminListAppointmentsQueryDto } from './admin-list-query.dto';

const router = Router();
const adminListAppointmentsController = new AdminListAppointmentsController();

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
router.get(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  queryValidationMiddleware(AdminListAppointmentsQueryDto),
  adminListAppointmentsController.handle.bind(adminListAppointmentsController)
);

export { router as adminListAppointmentsRoutes };
