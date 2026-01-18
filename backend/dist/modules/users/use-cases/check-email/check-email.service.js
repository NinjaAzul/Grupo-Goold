"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckEmailService = void 0;
const user_repository_1 = require("../../repositories/user.repository");
class CheckEmailService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    async execute({ email }) {
        const exists = await this.userRepository.emailExists(email);
        return { exists };
    }
}
exports.CheckEmailService = CheckEmailService;
//# sourceMappingURL=check-email.service.js.map