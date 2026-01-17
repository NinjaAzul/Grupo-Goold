"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRepository = void 0;
const user_model_1 = require("../../model/user.model");
const permissions_1 = require("@modules/permissions");
class LoginRepository {
    async findByEmail(email) {
        const user = await user_model_1.UserModel.findOne({
            where: { email },
            include: [
                {
                    model: permissions_1.PermissionModel,
                    as: 'permissions',
                    through: {
                        attributes: ['granted'],
                    },
                    attributes: ['id', 'name'],
                },
            ],
        });
        if (!user) {
            return null;
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
exports.LoginRepository = LoginRepository;
//# sourceMappingURL=login.repository.js.map