import { Router } from 'express';
import { AvailableRoomsController } from './available-rooms.controller';
import {
  ensureAuthenticated,
  ensurePermission,
  queryValidationMiddleware,
} from '@shared/middlewares';
import { PERMISSIONS } from '@shared/constants';
import { AvailableRoomsQueryDto } from './available-rooms.dto';

const router = Router();
const availableRoomsController = new AvailableRoomsController();

/**
 * @swagger
 * /appointments/available-rooms:
 *   get:
 *     summary: Buscar salas disponíveis para um horário específico
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data no formato YYYY-MM-DD
 *         example: "2025-01-25"
 *       - in: query
 *         name: time
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$'
 *         description: Horário no formato HH:mm
 *         example: "14:30"
 *     responses:
 *       200:
 *         description: Lista de salas disponíveis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rooms:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       name:
 *                         type: string
 *                       startTime:
 *                         type: string
 *                       endTime:
 *                         type: string
 *                       timeBlock:
 *                         type: number
 *       400:
 *         description: Data ou horário inválidos
 *       401:
 *         description: Não autorizado
 */
router.get(
  '/available-rooms',
  ensureAuthenticated,
  ensurePermission(PERMISSIONS.APPOINTMENTS),
  queryValidationMiddleware(AvailableRoomsQueryDto),
  availableRoomsController.handle.bind(availableRoomsController)
);

export { router as availableRoomsRoutes };
