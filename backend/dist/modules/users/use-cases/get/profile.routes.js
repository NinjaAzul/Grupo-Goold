"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileRoutes = void 0;
const express_1 = require("express");
const profile_controller_1 = require("./profile.controller");
const middlewares_1 = require("@shared/middlewares");
const router = (0, express_1.Router)();
exports.getProfileRoutes = router;
const getProfileController = new profile_controller_1.GetProfileController();
/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Obter dados do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     roleId:
 *                       type: integer
 *                     role:
 *                       type: object
 *                     city:
 *                       type: object
 *       401:
 *         description: Não autorizado
 */
router.get('/profile', middlewares_1.ensureAuthenticated, getProfileController.handle.bind(getProfileController));
//# sourceMappingURL=profile.routes.js.map