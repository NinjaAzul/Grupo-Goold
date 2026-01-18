"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAppointmentsRoutes = void 0;
const express_1 = require("express");
const list_controller_1 = require("./list.controller");
const middlewares_1 = require("@shared/middlewares");
const constants_1 = require("@shared/constants");
const list_query_dto_1 = require("./list-query.dto");
const router = (0, express_1.Router)();
exports.listAppointmentsRoutes = router;
const listAppointmentsController = new list_controller_1.ListAppointmentsController();
/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Listar agendamentos do usuário logado
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nome ou email do próprio usuário
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial para filtrar
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para filtrar
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, scheduled, cancelled]
 *         description: Filtrar por status
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *       401:
 *         description: Não autorizado
 */
router.get('/', middlewares_1.ensureAuthenticated, (0, middlewares_1.ensurePermission)(constants_1.PERMISSIONS.APPOINTMENTS), (0, middlewares_1.queryValidationMiddleware)(list_query_dto_1.ListAppointmentsQueryDto), listAppointmentsController.handle.bind(listAppointmentsController));
//# sourceMappingURL=list.routes.js.map