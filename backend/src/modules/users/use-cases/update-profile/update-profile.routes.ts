import { Router } from 'express';
import { UpdateProfileController } from './update-profile.controller';
import { ensureAuthenticated } from '@shared/middlewares';
import { validationMiddleware } from '@shared/middlewares';
import { UpdateProfileDto } from './update-profile.dto';

const router = Router();
const updateProfileController = new UpdateProfileController();

/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Atualizar perfil próprio (Autenticado)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *         description: Perfil atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.patch(
  '/profile',
  ensureAuthenticated,
  validationMiddleware(UpdateProfileDto),
  updateProfileController.handle.bind(updateProfileController)
);

export { router as updateProfileRoutes };
