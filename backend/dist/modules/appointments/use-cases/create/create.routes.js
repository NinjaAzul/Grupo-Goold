"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppointmentRoutes = void 0;
const express_1 = require("express");
const create_controller_1 = require("./create.controller");
const middlewares_1 = require("@shared/middlewares");
const constants_1 = require("@shared/constants");
const create_dto_1 = require("./create.dto");
const router = (0, express_1.Router)();
exports.createAppointmentRoutes = router;
const createAppointmentController = new create_controller_1.CreateAppointmentController();
/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Criar novo agendamento
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointmentDate
 *               - room
 *             properties:
 *               appointmentDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-25T14:00:00Z"
 *               room:
 *                 type: string
 *                 example: "Sala 012"
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post('/', middlewares_1.ensureAuthenticated, (0, middlewares_1.ensurePermission)(constants_1.PERMISSIONS.APPOINTMENTS), (0, middlewares_1.validationMiddleware)(create_dto_1.CreateAppointmentDto), createAppointmentController.handle.bind(createAppointmentController));
//# sourceMappingURL=create.routes.js.map