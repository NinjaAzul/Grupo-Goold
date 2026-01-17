"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPermissionRoutes = void 0;
const express_1 = require("express");
const update_permission_controller_1 = require("./update-permission.controller");
const middlewares_1 = require("@shared/middlewares");
const middlewares_2 = require("@shared/middlewares");
const update_permission_dto_1 = require("./update-permission.dto");
const router = (0, express_1.Router)();
exports.updateUserPermissionRoutes = router;
const updateUserPermissionController = new update_permission_controller_1.UpdateUserPermissionController();
/**
 * @swagger
 * /users/{userId}/permissions/{permissionId}:
 *   patch:
 *     summary: Atualizar permissão de usuário (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da permissão
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - granted
 *             properties:
 *               granted:
 *                 type: boolean
 *                 description: Se a permissão está concedida (true) ou negada (false)
 *     responses:
 *       200:
 *         description: Permissão atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário ou permissão não encontrado
 */
router.patch('/:userId/permissions/:permissionId', middlewares_1.ensureAuthenticated, middlewares_1.ensureAdmin, (0, middlewares_2.validationMiddleware)(update_permission_dto_1.UpdateUserPermissionDto), updateUserPermissionController.handle.bind(updateUserPermissionController));
//# sourceMappingURL=update-permission.routes.js.map