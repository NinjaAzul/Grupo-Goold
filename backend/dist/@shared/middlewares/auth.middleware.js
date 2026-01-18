"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = ensureAuthenticated;
require("@infra/database/models");
const jsonwebtoken_1 = require("jsonwebtoken");
const errors_1 = require("@shared/errors");
const user_model_1 = require("@modules/users/model/user.model");
const roles_1 = require("@modules/roles");
const permissions_1 = require("@modules/permissions");
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
                    {
                        model: permissions_1.PermissionModel,
                        as: 'permissions',
                        through: {
                            attributes: ['granted'],
                        },
                        attributes: ['id', 'name'],
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
            if (userJson.permissions && Array.isArray(userJson.permissions)) {
                userJson.permissions = userJson.permissions.map((perm) => {
                    const userPermissionModel = perm.UserPermissionModel;
                    let grantedValue = false;
                    if (userPermissionModel?.granted !== undefined) {
                        grantedValue = Boolean(userPermissionModel.granted);
                    }
                    return {
                        permission: {
                            id: perm.id,
                            name: perm.name,
                        },
                        granted: grantedValue,
                    };
                });
            }
            const formattedUser = userJson;
            if (!formattedUser.roleId) {
                const userJsonAny = userJson;
                if (userJsonAny.role_id) {
                    formattedUser.roleId = userJsonAny.role_id;
                }
                else if (formattedUser.role?.id) {
                    formattedUser.roleId = formattedUser.role.id;
                }
            }
            req.user = formattedUser;
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