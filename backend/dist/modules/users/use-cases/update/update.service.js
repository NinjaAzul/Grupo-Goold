"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserService = void 0;
const user_repository_1 = require("../../repositories/user.repository");
const logger_service_1 = require("@shared/utils/logger.service");
const errors_1 = require("@shared/errors");
const city_repository_1 = require("@modules/cities/repositories/city.repository");
const role_repository_1 = require("@/modules/roles/repositories/role.repository");
const user_model_1 = require("@modules/users/model/user.model");
const date_helper_1 = require("@shared/utils/date.helper");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UpdateUserService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
        this.cityRepository = new city_repository_1.CityRepository();
        this.roleRepository = new role_repository_1.RoleRepository();
    }
    async hashPassword(password) {
        return await bcrypt_1.default.hash(password, 10);
    }
    async execute(request) {
        const existingUser = await user_model_1.UserModel.findByPk(request.userId);
        if (!existingUser) {
            throw new errors_1.NotFoundError('Usuário não encontrado');
        }
        if (request.email && request.email !== existingUser.email) {
            const emailExists = await this.userRepository.emailExists(request.email);
            if (emailExists) {
                throw new errors_1.BadRequestError('Este e-mail já está em uso');
            }
        }
        if (request.cityId) {
            const city = await this.cityRepository.findById(request.cityId);
            if (!city) {
                throw new errors_1.NotFoundError('Cidade não encontrada');
            }
        }
        if (request.roleId) {
            const role = await this.roleRepository.findById(request.roleId);
            if (!role) {
                throw new errors_1.NotFoundError('Perfil não encontrado');
            }
        }
        const updateData = { ...request };
        if (request.password) {
            updateData.password = await this.hashPassword(request.password);
        }
        const user = await this.userRepository.update(updateData);
        if (!user) {
            throw new errors_1.NotFoundError('Usuário não encontrado');
        }
        await logger_service_1.LoggerService.log('Atualização de perfil', 'Minha Conta', user.id, `Usuário ${user.email} atualizou perfil`);
        return { user: date_helper_1.DateHelper.normalizeDatesInObject(user) };
    }
}
exports.UpdateUserService = UpdateUserService;
//# sourceMappingURL=update.service.js.map