"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncStatesRoutes = void 0;
const express_1 = require("express");
const sync_controller_1 = require("./sync.controller");
const router = (0, express_1.Router)();
exports.syncStatesRoutes = router;
const syncStatesController = new sync_controller_1.SyncStatesController();
/**
 * @swagger
 * /states/sync:
 *   post:
 *     summary: Sincronizar estados e cidades com API do IBGE
 *     tags: [States]
 *     description: Busca todos os estados e cidades do Brasil da API do IBGE e popula o banco de dados
 *     responses:
 *       200:
 *         description: Sincronização realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statesCount:
 *                   type: number
 *                   example: 27
 *                 citiesCount:
 *                   type: number
 *                   example: 5570
 *                 message:
 *                   type: string
 *                   example: Successfully synchronized 27 states and 5570 cities
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/sync', syncStatesController.handle);
//# sourceMappingURL=sync.routes.js.map