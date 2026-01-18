"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserPermissionService = void 0;
const user_permission_repository_1 = require("@modules/user-permissions/repositories/user-permission.repository");
const errors_1 = require("@shared/errors");
class UpdateUserPermissionService {
    constructor() {
        this.userPermissionRepository = new user_permission_repository_1.UserPermissionRepository();
    }
    async execute(data) {
        const user = await this.userPermissionRepository.findUserById(data.userId);
        if (!user) {
            throw new errors_1.NotFoundError('Usuário não encontrado');
        }
        const permission = await this.userPermissionRepository.findPermissionById(data.permissionId);
        if (!permission) {
            throw new errors_1.NotFoundError('Permissão não encontrada');
        }
        await this.userPermissionRepository.update(data);
        return {
            success: true,
            message: 'User permission updated successfully',
        };
    }
}
exports.UpdateUserPermissionService = UpdateUserPermissionService;
//# sourceMappingURL=update-permission.service.js.map