import { Router } from 'express';
import { CancelAppointmentController } from './cancel.controller';
import { ensureAuthenticated } from '@shared/middlewares';

const router = Router();
const cancelAppointmentController = new CancelAppointmentController();

/**
 * @swagger
 * /appointments/{id}/cancel:
 *   patch:
 *     summary: Cancelar agendamento (apenas o dono pode cancelar)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Agendamento cancelado com sucesso
 *       403:
 *         description: Não autorizado a cancelar este agendamento
 *       404:
 *         description: Agendamento não encontrado
 *       401:
 *         description: Não autorizado
 */
router.patch(
  '/:id/cancel',
  ensureAuthenticated,
  cancelAppointmentController.handle.bind(cancelAppointmentController)
);

export { router as cancelAppointmentRoutes };

