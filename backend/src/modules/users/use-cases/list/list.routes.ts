import { Router } from 'express';
import { ListUsersController } from './list.controller';
import { ensureAuthenticated, ensureAdmin } from '@shared/middlewares';

const router = Router();
const listUsersController = new ListUsersController();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar usuários (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nome (firstName ou lastName)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrar por email
 *       - in: query
 *         name: roleId
 *         schema:
 *           type: integer
 *         description: Filtrar por role ID (1=ADMIN, 2=USER)
 *       - in: query
 *         name: cityId
 *         schema:
 *           type: integer
 *         description: Filtrar por cidade ID
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       401:
 *         description: Não autorizado
 */
router.get(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  listUsersController.handle.bind(listUsersController)
);

export { router as listUsersRoutes };
