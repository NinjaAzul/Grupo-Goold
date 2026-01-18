"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myLogsRoutes = void 0;
const express_1 = require("express");
const my_logs_controller_1 = require("./my-logs.controller");
const middlewares_1 = require("@shared/middlewares");
const constants_1 = require("@shared/constants");
const my_logs_query_dto_1 = require("./my-logs-query.dto");
const router = (0, express_1.Router)();
exports.myLogsRoutes = router;
const myLogsController = new my_logs_controller_1.MyLogsController();
/**
 * @swagger
 * /logs/me:
 *   get:
 *     summary: Listar logs do usuário autenticado
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
 *         description: Lista de logs do usuário
 *       401:
 *         description: Não autorizado
 */
router.get('/me', middlewares_1.ensureAuthenticated, (0, middlewares_1.ensurePermission)(constants_1.PERMISSIONS.LOGS), (0, middlewares_1.queryValidationMiddleware)(my_logs_query_dto_1.MyLogsQueryDto), myLogsController.handle.bind(myLogsController));
//# sourceMappingURL=my-logs.routes.js.map