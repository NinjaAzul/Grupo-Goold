import { Router } from 'express';
import { CreateAppointmentController } from './create.controller';
import { ensureAuthenticated } from '@shared/middlewares';
import { validationMiddleware } from '@shared/middlewares';
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
 *               - room
 *             properties:
 *               appointmentDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-25T14:00:00Z"
 *               room:
 *                 type: string
 *                 example: "Sala 012"
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
  validationMiddleware(CreateAppointmentDto),
  createAppointmentController.handle.bind(createAppointmentController)
);

export { router as createAppointmentRoutes };

