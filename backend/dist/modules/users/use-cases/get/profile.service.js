"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProfileService = void 0;
const profile_repository_1 = require("./profile.repository");
class GetProfileService {
    constructor() {
        this.repository = new profile_repository_1.GetProfileRepository();
    }
    async execute(userId) {
        const user = await this.repository.findById(userId);
        return { user };
    }
}
exports.GetProfileService = GetProfileService;
//# sourceMappingURL=profile.service.js.map