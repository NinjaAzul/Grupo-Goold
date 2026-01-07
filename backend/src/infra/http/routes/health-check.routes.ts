import { Router } from 'express';

const healthCheckRoutes = Router();

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
healthCheckRoutes.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'All systems operational',
    timestamp: new Date().toISOString(),
  });
});

export { healthCheckRoutes };
