import { Router } from 'express';
import { GetProfileController } from './profile.controller';
import { ensureAuthenticated } from '@shared/middlewares';

const router = Router();
const getProfileController = new GetProfileController();

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Obter dados do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     roleId:
 *                       type: integer
 *                     role:
 *                       type: object
 *                     city:
 *                       type: object
 *       401:
 *         description: Não autorizado
 */
router.get(
  '/profile',
  ensureAuthenticated,
  getProfileController.handle.bind(getProfileController)
);

export { router as getProfileRoutes };
