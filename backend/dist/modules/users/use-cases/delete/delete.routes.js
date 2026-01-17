"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserRoutes = void 0;
const express_1 = require("express");
const delete_controller_1 = require("./delete.controller");
const middlewares_1 = require("@shared/middlewares");
const router = (0, express_1.Router)();
exports.deleteUserRoutes = router;
const deleteUserController = new delete_controller_1.DeleteUserController();
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deletar usuário (Admin only)
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
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso
 *       400:
 *         description: Não é possível deletar (último admin ou possui agendamentos)
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', middlewares_1.ensureAuthenticated, middlewares_1.ensureAdmin, deleteUserController.handle.bind(deleteUserController));
//# sourceMappingURL=delete.routes.js.map