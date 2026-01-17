"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const list_controller_1 = require("./list/list.controller");
const update_status_controller_1 = require("./update-status/update-status.controller");
const middlewares_1 = require("@shared/middlewares");
const adminRoutes = (0, express_1.Router)();
exports.adminRoutes = adminRoutes;
const listAppointmentsController = new list_controller_1.ListAppointmentsController();
const updateStatusController = new update_status_controller_1.UpdateStatusController();
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
adminRoutes.get('/appointments', middlewares_1.ensureAuthenticated, middlewares_1.ensureAdmin, listAppointmentsController.handle.bind(listAppointmentsController));
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
adminRoutes.patch('/appointments/:id/status', middlewares_1.ensureAuthenticated, middlewares_1.ensureAdmin, updateStatusController.handle.bind(updateStatusController));
//# sourceMappingURL=admin.routes.js.map