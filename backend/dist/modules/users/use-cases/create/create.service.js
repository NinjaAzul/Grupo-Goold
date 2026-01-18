"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserService = void 0;
const user_repository_1 = require("../../repositories/user.repository");
const errors_1 = require("@shared/errors");
const city_repository_1 = require("@modules/cities/repositories/city.repository");
const logger_service_1 = require("@shared/utils/logger.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
class CreateUserService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
        this.cityRepository = new city_repository_1.CityRepository();
    }
    async hashPassword(password) {
        return await bcrypt_1.default.hash(password, 10);
    }
    async formatUserPermissions(user) {
        const userJson = user;
        if (userJson.permissions && Array.isArray(userJson.permissions)) {
            userJson.permissions = userJson.permissions.map((perm) => ({
                permission: {
                    id: perm.id,
                    name: perm.name,
                },
                granted: perm.user_permissions?.granted ??
                    perm.granted ??
                    false,
            }));
        }
        return userJson;
    }
    async execute(request) {
        const emailExists = await this.userRepository.emailExists(request.email);
        if (emailExists) {
            throw new errors_1.ConflictError('Este e-mail já está cadastrado');
        }
        if (request.cityId) {
            const city = await this.cityRepository.findById(request.cityId);
            if (!city) {
                throw new errors_1.NotFoundError('Cidade não encontrada');
            }
        }
        const hashedPassword = await this.hashPassword(request.password);
        const user = await this.userRepository.create({
            ...request,
            password: hashedPassword,
        });
        if (!user) {
            throw new Error('Falha ao criar usuário');
        }
        const formattedUser = await this.formatUserPermissions(user);
        await logger_service_1.LoggerService.log('Criação de usuário', 'Minha Conta', formattedUser.id, `Usuário ${formattedUser.email} foi criado`);
        return { user: formattedUser };
    }
}
exports.CreateUserService = CreateUserService;
//# sourceMappingURL=create.service.js.map