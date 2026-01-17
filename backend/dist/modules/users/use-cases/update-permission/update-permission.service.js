"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserPermissionService = void 0;
const update_permission_repository_1 = require("./update-permission.repository");
class UpdateUserPermissionService {
    constructor() {
        this.repository = new update_permission_repository_1.UpdateUserPermissionRepository();
    }
    async execute(data) {
        await this.repository.update(data);
        return {
            success: true,
            message: 'User permission updated successfully',
        };
    }
}
exports.UpdateUserPermissionService = UpdateUserPermissionService;
//# sourceMappingURL=update-permission.service.js.map