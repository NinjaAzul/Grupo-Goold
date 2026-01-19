"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.availableRoomsRoutes = void 0;
const express_1 = require("express");
const available_rooms_controller_1 = require("./available-rooms.controller");
const middlewares_1 = require("@shared/middlewares");
const constants_1 = require("@shared/constants");
const available_rooms_dto_1 = require("./available-rooms.dto");
const router = (0, express_1.Router)();
exports.availableRoomsRoutes = router;
const availableRoomsController = new available_rooms_controller_1.AvailableRoomsController();
/**
 * @swagger
 * /appointments/available-rooms:
 *   get:
 *     summary: Buscar salas disponíveis para um horário específico
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
 *         name: time
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$'
 *         description: Horário no formato HH:mm
 *         example: "14:30"
 *     responses:
 *       200:
 *         description: Lista de salas disponíveis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rooms:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       name:
 *                         type: string
 *                       startTime:
 *                         type: string
 *                       endTime:
 *                         type: string
 *                       timeBlock:
 *                         type: number
 *       400:
 *         description: Data ou horário inválidos
 *       401:
 *         description: Não autorizado
 */
router.get('/available-rooms', middlewares_1.ensureAuthenticated, (0, middlewares_1.ensurePermission)(constants_1.PERMISSIONS.APPOINTMENTS), (0, middlewares_1.queryValidationMiddleware)(available_rooms_dto_1.AvailableRoomsQueryDto), availableRoomsController.handle.bind(availableRoomsController));
//# sourceMappingURL=available-rooms.routes.js.map