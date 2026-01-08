"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listStatesRoutes = void 0;
const express_1 = require("express");
const list_controller_1 = require("./list.controller");
const router = (0, express_1.Router)();
exports.listStatesRoutes = router;
const listStatesController = new list_controller_1.ListStatesController();
/**
 * @swagger
 * /states:
 *   get:
 *     summary: Listar todos os estados
 *     tags: [States]
 *     description: Retorna a lista de todos os estados do Brasil ordenados por UF
 *     responses:
 *       200:
 *         description: Lista de estados retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 states:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 35
 *                       name:
 *                         type: string
 *                         example: São Paulo
 *                       uf:
 *                         type: string
 *                         example: SP
 *                 total:
 *                   type: number
 *                   example: 27
 */
router.get('/', listStatesController.handle);
//# sourceMappingURL=list.routes.js.map