import { Router } from 'express';
import { ListLogsController } from './list.controller';
import { ensureAuthenticated, ensureAdmin } from '@shared/middlewares';

const router = Router();
const listLogsController = new ListLogsController();

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
router.get(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  listLogsController.handle.bind(listLogsController)
);

export { router as listLogsRoutes };
