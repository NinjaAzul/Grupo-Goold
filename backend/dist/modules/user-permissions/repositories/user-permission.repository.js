"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPermissionRepository = void 0;
const user_permission_model_1 = require("../model/user-permission.model");
const permissions_1 = require("@modules/permissions");
const user_model_1 = require("@modules/users/model/user.model");
class UserPermissionRepository {
    async findUserById(userId) {
        const user = await user_model_1.UserModel.findByPk(userId);
        return user ? { id: user.id } : null;
    }
    async findPermissionById(permissionId) {
        const permission = await permissions_1.PermissionModel.findByPk(permissionId);
        return permission ? { id: permission.id } : null;
    }
    async update(data) {
        const userPermission = await user_permission_model_1.UserPermissionModel.findOne({
            where: {
                userId: data.userId,
                permissionId: data.permissionId,
            },
        });
        if (!userPermission) {
            await user_permission_model_1.UserPermissionModel.create({
                userId: data.userId,
                permissionId: data.permissionId,
                granted: data.granted,
            });
        }
        else {
            await userPermission.update({ granted: data.granted });
            await userPermission.reload();
        }
    }
}
exports.UserPermissionRepository = UserPermissionRepository;
//# sourceMappingURL=user-permission.repository.js.map