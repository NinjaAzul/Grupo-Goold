import { Router } from 'express';
import { ListStatesController } from './list.controller';

const router = Router();
const listStatesController = new ListStatesController();

/**
 * @swagger
 * /states:
 *   get:
 *     summary: Listar todos os estados
 *     tags: [States]
 *     description: Retorna a lista de todos os estados do Brasil ordenados por UF
 *     responses:
 *       200:
 *         description: Lista de estados retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 states:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 35
 *                       name:
 *                         type: string
 *                         example: São Paulo
 *                       uf:
 *                         type: string
 *                         example: SP
 *                 total:
 *                   type: number
 *                   example: 27
 */
router.get('/', listStatesController.handle);

export { router as listStatesRoutes };
