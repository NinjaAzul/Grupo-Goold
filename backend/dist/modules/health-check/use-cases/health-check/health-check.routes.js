"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheckRoutes = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.healthCheckRoutes = router;
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     description: Verifica o status da API e conexão com o banco de dados
 *     responses:
 *       200:
 *         description: API está funcionando corretamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: All systems operational
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-01T00:00:00.000Z
 */
router.get('/', (_req, res) => {
    res.json({
        status: 'ok',
        message: 'All systems operational',
        timestamp: new Date().toISOString(),
    });
});
//# sourceMappingURL=health-check.routes.js.map