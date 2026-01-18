"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminListAppointmentsRoutes = void 0;
const express_1 = require("express");
const admin_list_controller_1 = require("./admin-list.controller");
const middlewares_1 = require("@shared/middlewares");
const admin_list_query_dto_1 = require("./admin-list-query.dto");
const router = (0, express_1.Router)();
exports.adminListAppointmentsRoutes = router;
const adminListAppointmentsController = new admin_list_controller_1.AdminListAppointmentsController();
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
router.get('/', middlewares_1.ensureAuthenticated, middlewares_1.ensureAdmin, (0, middlewares_1.queryValidationMiddleware)(admin_list_query_dto_1.AdminListAppointmentsQueryDto), adminListAppointmentsController.handle.bind(adminListAppointmentsController));
//# sourceMappingURL=admin-list.routes.js.map