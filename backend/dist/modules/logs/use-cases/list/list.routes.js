"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLogsRoutes = void 0;
const express_1 = require("express");
const list_controller_1 = require("./list.controller");
const middlewares_1 = require("@shared/middlewares");
const list_query_dto_1 = require("./list-query.dto");
const router = (0, express_1.Router)();
exports.listLogsRoutes = router;
const listLogsController = new list_controller_1.ListLogsController();
/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Listar logs (Admin only)
 *     tags: [Logs]
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
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do usuário
 *       - in: query
 *         name: activityType
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de atividade
 *       - in: query
 *         name: module
 *         schema:
 *           type: string
 *         description: Filtrar por módulo
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar por data inicial
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar por data final
 *     responses:
 *       200:
 *         description: Lista de logs
 *       401:
 *         description: Não autorizado
 */
router.get('/', middlewares_1.ensureAuthenticated, middlewares_1.ensureAdmin, (0, middlewares_1.queryValidationMiddleware)(list_query_dto_1.ListLogsQueryDto), listLogsController.handle.bind(listLogsController));
//# sourceMappingURL=list.routes.js.map