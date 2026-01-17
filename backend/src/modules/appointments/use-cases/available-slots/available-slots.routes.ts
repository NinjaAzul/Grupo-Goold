import { Router } from 'express';
import { AvailableSlotsController } from './available-slots.controller';
import {
  ensureAuthenticated,
  ensurePermission,
  queryValidationMiddleware,
} from '@shared/middlewares';
import { PERMISSIONS } from '@shared/constants';
import { AvailableSlotsQueryDto } from './available-slots.dto';

const router = Router();
const availableSlotsController = new AvailableSlotsController();

/**
 * @swagger
 * /appointments/available:
 *   get:
 *     summary: Buscar horários disponíveis para agendamento
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
 *         name: roomId
 *         schema:
 *           type: integer
 *         description: ID da sala (opcional, se não informado retorna para todas as salas)
 *     responses:
 *       200:
 *         description: Lista de horários disponíveis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 slots:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "08:00"
 *       400:
 *         description: Data não informada
 *       401:
 *         description: Não autorizado
 */
router.get(
  '/available',
  ensureAuthenticated,
  ensurePermission(PERMISSIONS.APPOINTMENTS),
  queryValidationMiddleware(AvailableSlotsQueryDto),
  availableSlotsController.handle.bind(availableSlotsController)
);

export { router as availableSlotsRoutes };
