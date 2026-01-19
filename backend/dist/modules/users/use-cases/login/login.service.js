"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const user_repository_1 = require("../../repositories/user.repository");
const errors_1 = require("@shared/errors");
const logger_service_1 = require("@shared/utils/logger.service");
const date_helper_1 = require("@shared/utils/date.helper");
class LoginService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    async execute({ email, password }) {
        const user = await this.userRepository.findByEmail(email, {
            includePermissions: true,
            excludePassword: false,
        });
        if (!user) {
            throw new errors_1.UnauthorizedError('E-mail ou senha incorretos');
        }
        if (!user.active) {
            throw new errors_1.UnauthorizedError('Sua conta está desativada. Entre em contato com o administrador.');
        }
        const passwordMatch = await (0, bcrypt_1.compare)(password, user.password);
        if (!passwordMatch) {
            throw new errors_1.UnauthorizedError('E-mail ou senha incorretos');
        }
        const { password: _, ...userWithoutPassword } = user;
        const token = (0, jsonwebtoken_1.sign)({}, process.env.JWT_SECRET, {
            subject: String(user.id),
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        const tokenReturn = {
            user: date_helper_1.DateHelper.normalizeDatesInObject(userWithoutPassword),
            token,
        };
        await logger_service_1.LoggerService.log('Login', 'Minha Conta', user.id, `Usuário ${user.email} realizou login`);
        return tokenReturn;
    }
}
exports.LoginService = LoginService;
//# sourceMappingURL=login.service.js.map