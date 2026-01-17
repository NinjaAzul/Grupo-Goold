"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProfileRepository = void 0;
const user_model_1 = require("@modules/users/model/user.model");
const roles_1 = require("@modules/roles");
const city_model_1 = require("@modules/cities/model/city.model");
const permissions_1 = require("@modules/permissions");
const errors_1 = require("@shared/errors");
class GetProfileRepository {
    async findById(userId) {
        const user = await user_model_1.UserModel.findByPk(userId, {
            include: [
                {
                    model: roles_1.RoleModel,
                    as: 'role',
                },
                {
                    model: city_model_1.CityModel,
                    as: 'city',
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
            },
        });
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        // Formatar permissões para o formato esperado
        const userJson = user.toJSON();
        if (userJson.permissions && Array.isArray(userJson.permissions)) {
            userJson.permissions = userJson.permissions.map((perm) => {
                // O Sequelize retorna o through model como UserPermissionModel (nome do modelo)
                let grantedValue = false;
                const userPermissionModel = perm.UserPermissionModel;
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
        return userJson;
    }
}
exports.GetProfileRepository = GetProfileRepository;
//# sourceMappingURL=profile.repository.js.map