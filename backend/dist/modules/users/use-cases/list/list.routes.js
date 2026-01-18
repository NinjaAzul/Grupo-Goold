"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersRoutes = void 0;
const express_1 = require("express");
const list_controller_1 = require("./list.controller");
const middlewares_1 = require("@shared/middlewares");
const list_query_dto_1 = require("./list-query.dto");
const router = (0, express_1.Router)();
exports.listUsersRoutes = router;
const listUsersController = new list_controller_1.ListUsersController();
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar usuários (Admin only)
 *     tags: [Users]
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
 *         description: Filtrar por nome (firstName ou lastName)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrar por email
 *       - in: query
 *         name: roleId
 *         schema:
 *           type: integer
 *         description: Filtrar por role ID (1=ADMIN, 2=USER)
 *       - in: query
 *         name: cityId
 *         schema:
 *           type: integer
 *         description: Filtrar por cidade ID
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filtrar por status ativo/inativo
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial para filtrar por data de criação (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para filtrar por data de criação (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       401:
 *         description: Não autorizado
 */
router.get('/', middlewares_1.ensureAuthenticated, middlewares_1.ensureAdmin, (0, middlewares_1.queryValidationMiddleware)(list_query_dto_1.ListUsersQueryDto), listUsersController.handle.bind(listUsersController));
//# sourceMappingURL=list.routes.js.map