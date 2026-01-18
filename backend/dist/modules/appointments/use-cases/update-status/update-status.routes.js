"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusRoutes = void 0;
const express_1 = require("express");
const update_status_controller_1 = require("./update-status.controller");
const middlewares_1 = require("@shared/middlewares");
const update_status_dto_1 = require("./update-status.dto");
const router = (0, express_1.Router)();
exports.updateStatusRoutes = router;
const updateStatusController = new update_status_controller_1.UpdateStatusController();
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
 *         description: Agendamento não encontrado
 */
router.patch('/:id/status', middlewares_1.ensureAuthenticated, middlewares_1.ensureAdmin, (0, middlewares_1.validationMiddleware)(update_status_dto_1.UpdateStatusDto), updateStatusController.handle.bind(updateStatusController));
//# sourceMappingURL=update-status.routes.js.map