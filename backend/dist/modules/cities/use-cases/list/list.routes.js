"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCitiesRoutes = void 0;
const express_1 = require("express");
const list_controller_1 = require("./list.controller");
const router = (0, express_1.Router)();
exports.listCitiesRoutes = router;
const listCitiesController = new list_controller_1.ListCitiesController();
/**
 * @swagger
 * /cities:
 *   get:
 *     summary: Listar cidades
 *     tags: [Cities]
 *     description: Retorna a lista de cidades. Pode ser filtrada por estado usando o parâmetro stateId
 *     parameters:
 *       - in: query
 *         name: stateId
 *         schema:
 *           type: integer
 *         description: ID do estado (IBGE code) para filtrar cidades (opcional)
 *         example: 35
 *       - in: query
 *         name: uf
 *         schema:
 *           type: string
 *         description: Sigla do estado (UF) para filtrar cidades (opcional). Exemplos: SP, RJ, MG
 *         example: SP
 *     responses:
 *       200:
 *         description: Lista de cidades retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 3550308
 *                       name:
 *                         type: string
 *                         example: São Paulo
 *                       stateId:
 *                         type: number
 *                         example: 35
 *                 total:
 *                   type: number
 *                   example: 645
 */
router.get('/', listCitiesController.handle);
//# sourceMappingURL=list.routes.js.map