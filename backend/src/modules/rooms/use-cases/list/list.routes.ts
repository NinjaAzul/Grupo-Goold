import { Router } from 'express';
import { ListRoomsController } from './list.controller';
import { ensureAuthenticated } from '@shared/middlewares';

const router = Router();
const listRoomsController = new ListRoomsController();

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Listar todas as salas (Autenticado)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de salas
 *       401:
 *         description: Não autorizado
 */
router.get(
  '/',
  ensureAuthenticated,
  listRoomsController.handle.bind(listRoomsController)
);

export { router as listRoomsRoutes };
