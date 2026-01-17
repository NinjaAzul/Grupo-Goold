import { Router } from 'express';
import { ListAppointmentsController } from './list.controller';
import {
  ensureAuthenticated,
  ensurePermission,
  queryValidationMiddleware,
} from '@shared/middlewares';
import { PERMISSIONS } from '@shared/constants';
import { ListAppointmentsQueryDto } from './list-query.dto';

const router = Router();
const listAppointmentsController = new ListAppointmentsController();

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Listar agendamentos do usuário logado
 *     tags: [Appointments]
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
 *         description: Filtrar por nome ou email do próprio usuário
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial para filtrar
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para filtrar
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, scheduled, cancelled]
 *         description: Filtrar por status
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *       401:
 *         description: Não autorizado
 */
router.get(
  '/',
  ensureAuthenticated,
  ensurePermission(PERMISSIONS.APPOINTMENTS),
  queryValidationMiddleware(ListAppointmentsQueryDto),
  listAppointmentsController.handle.bind(listAppointmentsController)
);

export { router as listAppointmentsRoutes };
