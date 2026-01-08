import { Router } from 'express';
import { UpdateUserController } from './update.controller';
import { ensureAuthenticated, ensureAdmin } from '@shared/middlewares';
import { validationMiddleware } from '@shared/middlewares';
import { UpdateUserDto } from './update.dto';

const router = Router();
const updateUserController = new UpdateUserController();

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Atualizar usuário (Admin only)
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               roleId:
 *                 type: integer
 *               zipCode:
 *                 type: string
 *               street:
 *                 type: string
 *               number:
 *                 type: string
 *               complement:
 *                 type: string
 *               neighborhood:
 *                 type: string
 *               cityId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.patch(
  '/:id',
  ensureAuthenticated,
  ensureAdmin,
  validationMiddleware(UpdateUserDto),
  updateUserController.handle.bind(updateUserController)
);

export { router as updateUserRoutes };
