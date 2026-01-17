"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRoomsRoutes = void 0;
const express_1 = require("express");
const list_controller_1 = require("./list.controller");
const middlewares_1 = require("@shared/middlewares");
const router = (0, express_1.Router)();
exports.listRoomsRoutes = router;
const listRoomsController = new list_controller_1.ListRoomsController();
/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Listar todas as salas (Autenticado)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de salas
 *       401:
 *         description: Não autorizado
 */
router.get('/', middlewares_1.ensureAuthenticated, listRoomsController.handle.bind(listRoomsController));
//# sourceMappingURL=list.routes.js.map