import { Router } from 'express';
import { CreateAppointmentController } from './create.controller';
import {
  ensureAuthenticated,
  ensurePermission,
  validationMiddleware,
} from '@shared/middlewares';
import { PERMISSIONS } from '@shared/constants';
import { CreateAppointmentDto } from './create.dto';

const router = Router();
const createAppointmentController = new CreateAppointmentController();

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Criar novo agendamento
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointmentDate
 *               - roomId
 *             properties:
 *               appointmentDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-25T14:00:00Z"
 *               roomId:
 *                 type: number
 *                 minimum: 1
 *                 example: 1
 *                 description: ID da sala de agendamento
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post(
  '/',
  ensureAuthenticated,
  ensurePermission(PERMISSIONS.APPOINTMENTS),
  validationMiddleware(CreateAppointmentDto),
  createAppointmentController.handle.bind(createAppointmentController)
);

export { router as createAppointmentRoutes };
