"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserPermissionRepository = void 0;
const user_permissions_1 = require("@modules/user-permissions");
const permissions_1 = require("@modules/permissions");
const user_model_1 = require("@modules/users/model/user.model");
const errors_1 = require("@shared/errors");
class UpdateUserPermissionRepository {
    async update(data) {
        // Verificar se o usuário existe
        const user = await user_model_1.UserModel.findByPk(data.userId);
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        // Verificar se a permissão existe
        const permission = await permissions_1.PermissionModel.findByPk(data.permissionId);
        if (!permission) {
            throw new errors_1.NotFoundError('Permission not found');
        }
        // Buscar a relação user_permission existente
        const userPermission = await user_permissions_1.UserPermissionModel.findOne({
            where: {
                userId: data.userId,
                permissionId: data.permissionId,
            },
        });
        // Se não existir, criar
        if (!userPermission) {
            await user_permissions_1.UserPermissionModel.create({
                userId: data.userId,
                permissionId: data.permissionId,
                granted: data.granted,
            });
        }
        else {
            // Se já existia, atualizar
            await userPermission.update({ granted: data.granted });
            await userPermission.reload();
        }
    }
}
exports.UpdateUserPermissionRepository = UpdateUserPermissionRepository;
//# sourceMappingURL=update-permission.repository.js.map