"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckEmailService = void 0;
const check_email_repository_1 = require("./check-email.repository");
class CheckEmailService {
    constructor() {
        this.checkEmailRepository = new check_email_repository_1.CheckEmailRepository();
    }
    async execute({ email }) {
        const exists = await this.checkEmailRepository.exists(email);
        return { exists };
    }
}
exports.CheckEmailService = CheckEmailService;
//# sourceMappingURL=check-email.service.js.map