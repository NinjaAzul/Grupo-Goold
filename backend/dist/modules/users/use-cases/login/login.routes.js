"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRoutes = void 0;
const express_1 = require("express");
const login_controller_1 = require("./login.controller");
const middlewares_1 = require("@shared/middlewares");
const login_dto_1 = require("./login.dto");
const router = (0, express_1.Router)();
exports.loginRoutes = router;
const loginController = new login_controller_1.LoginController();
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
router.post('/', (0, middlewares_1.validationMiddleware)(login_dto_1.LoginDto), loginController.handle);
//# sourceMappingURL=login.routes.js.map