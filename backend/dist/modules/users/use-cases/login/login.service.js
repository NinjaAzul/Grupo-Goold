"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const login_repository_1 = require("./login.repository");
const errors_1 = require("@shared/errors");
const logger_service_1 = require("@shared/utils/logger.service");
class LoginService {
    constructor() {
        this.loginRepository = new login_repository_1.LoginRepository();
    }
    async execute({ email, password }) {
        const user = await this.loginRepository.findByEmail(email);
        if (!user) {
            throw new errors_1.UnauthorizedError('Email or password incorrect');
        }
        const passwordMatch = await (0, bcrypt_1.compare)(password, user.password);
        if (!passwordMatch) {
            throw new errors_1.UnauthorizedError('Email or password incorrect');
        }
        const { password: _, ...userWithoutPassword } = user;
        const token = (0, jsonwebtoken_1.sign)({}, process.env.JWT_SECRET, {
            subject: String(user.id),
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        const tokenReturn = {
            user: userWithoutPassword,
            token,
        };
        // Registrar log de login
        await logger_service_1.LoggerService.log('Login', 'Minha Conta', user.id, `Usuário ${user.email} realizou login`);
        return tokenReturn;
    }
}
exports.LoginService = LoginService;
//# sourceMappingURL=login.service.js.map