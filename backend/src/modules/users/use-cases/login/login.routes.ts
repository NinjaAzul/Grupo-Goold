import { Router } from 'express';
import { LoginController } from './login.controller';
import { validationMiddleware } from '@shared/middlewares';
import { LoginDto } from './login.dto';

const router = Router();
const loginController = new LoginController();

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Realizar login
 *     tags: [Users]
 *     description: Autentica um usuário e retorna um token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     firstName:
 *                       type: string
 *                       example: Admin
 *                     lastName:
 *                       type: string
 *                       example: Sistema
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *                     roleId:
 *                       type: number
 *                       example: 1
 *       401:
 *         description: Email ou senha incorretos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email or password incorrect
 */
router.post('/', validationMiddleware(LoginDto), loginController.handle);

export { router as loginRoutes };
