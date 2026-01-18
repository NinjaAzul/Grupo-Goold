"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelAppointmentRoutes = void 0;
const express_1 = require("express");
const cancel_controller_1 = require("./cancel.controller");
const middlewares_1 = require("@shared/middlewares");
const constants_1 = require("@shared/constants");
const router = (0, express_1.Router)();
exports.cancelAppointmentRoutes = router;
const cancelAppointmentController = new cancel_controller_1.CancelAppointmentController();
/**
 * @swagger
 * /appointments/{id}/cancel:
 *   patch:
 *     summary: Cancelar agendamento (apenas o dono pode cancelar)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Agendamento cancelado com sucesso
 *       403:
 *         description: Não autorizado a cancelar este agendamento
 *       404:
 *         description: Agendamento não encontrado
 *       401:
 *         description: Não autorizado
 */
router.patch('/:id/cancel', middlewares_1.ensureAuthenticated, (0, middlewares_1.ensurePermission)(constants_1.PERMISSIONS.APPOINTMENTS), cancelAppointmentController.handle.bind(cancelAppointmentController));
//# sourceMappingURL=cancel.routes.js.map