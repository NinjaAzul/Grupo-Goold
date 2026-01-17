"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckEmailRepository = void 0;
const user_model_1 = require("../../model/user.model");
class CheckEmailRepository {
    async exists(email) {
        const user = await user_model_1.UserModel.findOne({
            where: { email },
            attributes: ['id'],
        });
        return !!user;
    }
}
exports.CheckEmailRepository = CheckEmailRepository;
//# sourceMappingURL=check-email.repository.js.map