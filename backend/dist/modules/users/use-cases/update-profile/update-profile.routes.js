"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileRoutes = void 0;
const express_1 = require("express");
const update_profile_controller_1 = require("./update-profile.controller");
const middlewares_1 = require("@shared/middlewares");
const middlewares_2 = require("@shared/middlewares");
const update_profile_dto_1 = require("./update-profile.dto");
const router = (0, express_1.Router)();
exports.updateProfileRoutes = router;
const updateProfileController = new update_profile_controller_1.UpdateProfileController();
/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Atualizar perfil próprio (Autenticado)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *         description: Perfil atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.patch('/profile', middlewares_1.ensureAuthenticated, (0, middlewares_2.validationMiddleware)(update_profile_dto_1.UpdateProfileDto), updateProfileController.handle.bind(updateProfileController));
//# sourceMappingURL=update-profile.routes.js.map