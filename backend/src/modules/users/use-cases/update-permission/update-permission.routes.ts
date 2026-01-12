import { Router } from 'express';
import { UpdateUserPermissionController } from './update-permission.controller';
import { ensureAuthenticated, ensureAdmin } from '@shared/middlewares';
import { validationMiddleware } from '@shared/middlewares';
import { UpdateUserPermissionDto } from './update-permission.dto';

const router = Router();
const updateUserPermissionController = new UpdateUserPermissionController();

/**
 * @swagger
 * /users/{userId}/permissions/{permissionId}:
 *   patch:
 *     summary: Atualizar permissão de usuário (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da permissão
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - granted
 *             properties:
 *               granted:
 *                 type: boolean
 *                 description: Se a permissão está concedida (true) ou negada (false)
 *     responses:
 *       200:
 *         description: Permissão atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário ou permissão não encontrado
 */
router.patch(
  '/:userId/permissions/:permissionId',
  ensureAuthenticated,
  ensureAdmin,
  validationMiddleware(UpdateUserPermissionDto),
  updateUserPermissionController.handle.bind(updateUserPermissionController)
);

export { router as updateUserPermissionRoutes };
