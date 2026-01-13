import { Router } from 'express';
import { CheckEmailController } from './check-email.controller';
import { validationMiddleware } from '@shared/middlewares';
import { CheckEmailDto } from './check-email.dto';

const router = Router();
const checkEmailController = new CheckEmailController();

/**
 * @swagger
 * /users/check-email:
 *   post:
 *     summary: Verificar se email existe
 *     tags: [Users]
 *     description: Verifica se um email já está cadastrado no sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *     responses:
 *       200:
 *         description: Verificação realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   example: true
 */
router.post(
  '/check-email',
  validationMiddleware(CheckEmailDto),
  checkEmailController.handle.bind(checkEmailController)
);

export { router as checkEmailRoutes };
