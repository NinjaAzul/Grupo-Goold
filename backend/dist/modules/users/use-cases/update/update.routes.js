"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoutes = void 0;
const express_1 = require("express");
const update_controller_1 = require("./update.controller");
const middlewares_1 = require("@shared/middlewares");
const middlewares_2 = require("@shared/middlewares");
const update_dto_1 = require("./update.dto");
const router = (0, express_1.Router)();
exports.updateUserRoutes = router;
const updateUserController = new update_controller_1.UpdateUserController();
/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Atualizar usuário (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
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
 *               roleId:
 *                 type: integer
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
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.patch('/:id', middlewares_1.ensureAuthenticated, middlewares_1.ensureAdmin, (0, middlewares_2.validationMiddleware)(update_dto_1.UpdateUserDto), updateUserController.handle.bind(updateUserController));
//# sourceMappingURL=update.routes.js.map