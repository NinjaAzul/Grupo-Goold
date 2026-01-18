"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.availableSlotsRoutes = void 0;
const express_1 = require("express");
const available_slots_controller_1 = require("./available-slots.controller");
const middlewares_1 = require("@shared/middlewares");
const constants_1 = require("@shared/constants");
const available_slots_dto_1 = require("./available-slots.dto");
const router = (0, express_1.Router)();
exports.availableSlotsRoutes = router;
const availableSlotsController = new available_slots_controller_1.AvailableSlotsController();
/**
 * @swagger
 * /appointments/available:
 *   get:
 *     summary: Buscar horários disponíveis para agendamento
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data no formato YYYY-MM-DD
 *         example: "2025-01-25"
 *       - in: query
 *         name: roomId
 *         schema:
 *           type: integer
 *         description: ID da sala (opcional, se não informado retorna para todas as salas)
 *     responses:
 *       200:
 *         description: Lista de horários disponíveis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 slots:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "08:00"
 *       400:
 *         description: Data não informada
 *       401:
 *         description: Não autorizado
 */
router.get('/available', middlewares_1.ensureAuthenticated, (0, middlewares_1.ensurePermission)(constants_1.PERMISSIONS.APPOINTMENTS), (0, middlewares_1.queryValidationMiddleware)(available_slots_dto_1.AvailableSlotsQueryDto), availableSlotsController.handle.bind(availableSlotsController));
//# sourceMappingURL=available-slots.routes.js.map