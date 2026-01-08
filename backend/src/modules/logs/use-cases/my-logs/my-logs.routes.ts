import { Router } from 'express';
import { MyLogsController } from './my-logs.controller';
import { ensureAuthenticated } from '@shared/middlewares';

const router = Router();
const myLogsController = new MyLogsController();

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
router.get(
  '/me',
  ensureAuthenticated,
  myLogsController.handle.bind(myLogsController)
);

export { router as myLogsRoutes };
