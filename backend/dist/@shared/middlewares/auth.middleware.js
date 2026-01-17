"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = ensureAuthenticated;
const jsonwebtoken_1 = require("jsonwebtoken");
const errors_1 = require("@shared/errors");
const user_model_1 = require("@modules/users/model/user.model");
const roles_1 = require("@modules/roles");
// Importar models para garantir que as associações estejam carregadas
require("@infra/database/models");
async function ensureAuthenticated(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(new errors_1.UnauthorizedError('Token not provided'));
        }
        const [, token] = authHeader.split(' ');
        if (!token) {
            return next(new errors_1.UnauthorizedError('Token not provided'));
        }
        try {
            const { sub: id } = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
            const user = await user_model_1.UserModel.findByPk(id, {
                include: [
                    {
                        model: roles_1.RoleModel,
                        as: 'role',
                    },
                ],
                attributes: {
                    exclude: ['password'],
                    include: ['roleId'],
                },
            });
            if (!user) {
                return next(new errors_1.UnauthorizedError('User does not exist'));
            }
            const userJson = user.toJSON();
            if (!userJson.roleId) {
                const userJsonAny = userJson;
                if (userJsonAny.role_id) {
                    userJson.roleId = userJsonAny.role_id;
                }
                else if (userJson.role?.id) {
                    userJson.roleId = userJson.role.id;
                }
            }
            req.user = userJson;
            req.token = token;
            next();
        }
        catch (error) {
            if (error instanceof errors_1.UnauthorizedError) {
                return next(error);
            }
            return next(new errors_1.UnauthorizedError('Invalid token'));
        }
    }
    catch (error) {
        return next(error);
    }
}
//# sourceMappingURL=auth.middleware.js.map