"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProfileService = void 0;
const user_repository_1 = require("../../repositories/user.repository");
const errors_1 = require("@shared/errors");
class GetProfileService {
    constructor() {
        this.repository = new user_repository_1.UserRepository();
    }
    async execute(userId) {
        const user = await this.repository.findById(userId, {
            includeRole: true,
            includeCity: true,
            includePermissions: true,
            excludePassword: true,
        });
        if (!user) {
            throw new errors_1.NotFoundError('Usuário não encontrado');
        }
        return { user };
    }
}
exports.GetProfileService = GetProfileService;
//# sourceMappingURL=profile.service.js.map