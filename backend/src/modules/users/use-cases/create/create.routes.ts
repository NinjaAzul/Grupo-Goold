import { Router } from 'express';
import { CreateUserController } from './create.controller';
import { validationMiddleware } from '@shared/middlewares';
import { CreateUserDto } from './create.dto';

const router = Router();
const createUserController = new CreateUserController();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Criar novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - password
 *             properties:
 *               roleId:
 *                 type: integer
 *                 example: 1
 *                 description: Role ID (1=ADMIN, 2=USER). If not provided, default is USER
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *               zipCode:
 *                 type: string
 *                 example: "01310-100"
 *               street:
 *                 type: string
 *                 example: Main Street
 *               number:
 *                 type: string
 *                 example: "1000"
 *               complement:
 *                 type: string
 *                 example: Apt 101
 *               neighborhood:
 *                 type: string
 *                 example: Downtown
 *               cityId:
 *                 type: integer
 *                 example: 3550308
 *                 description: ID da cidade (IBGE code). O estado será obtido automaticamente através da cidade
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post(
  '/',
  validationMiddleware(CreateUserDto),
  createUserController.handle
);

export { router as createUserRoutes };
