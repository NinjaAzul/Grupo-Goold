"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const role_model_1 = require("@modules/roles/model/role.model");
class RoleRepository {
    async findById(roleId) {
        const role = await role_model_1.RoleModel.findByPk(roleId);
        return role ? role.toJSON() : null;
    }
}
exports.RoleRepository = RoleRepository;
//# sourceMappingURL=role.repository.js.map