"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmailRoutes = void 0;
const express_1 = require("express");
const check_email_controller_1 = require("./check-email.controller");
const middlewares_1 = require("@shared/middlewares");
const check_email_dto_1 = require("./check-email.dto");
const router = (0, express_1.Router)();
exports.checkEmailRoutes = router;
const checkEmailController = new check_email_controller_1.CheckEmailController();
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
router.post('/check-email', (0, middlewares_1.validationMiddleware)(check_email_dto_1.CheckEmailDto), checkEmailController.handle.bind(checkEmailController));
//# sourceMappingURL=check-email.routes.js.map