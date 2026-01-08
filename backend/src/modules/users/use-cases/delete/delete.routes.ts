import { Router } from 'express';
import { DeleteUserController } from './delete.controller';
import { ensureAuthenticated, ensureAdmin } from '@shared/middlewares';

const router = Router();
const deleteUserController = new DeleteUserController();

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deletar usuário (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso
 *       400:
 *         description: Não é possível deletar (último admin ou possui agendamentos)
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.delete(
  '/:id',
  ensureAuthenticated,
  ensureAdmin,
  deleteUserController.handle.bind(deleteUserController)
);

export { router as deleteUserRoutes };
