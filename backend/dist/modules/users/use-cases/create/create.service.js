"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserService = void 0;
const create_repository_1 = require("./create.repository");
const errors_1 = require("@shared/errors");
const cities_1 = require("@modules/cities");
const logger_service_1 = require("@shared/utils/logger.service");
class CreateUserService {
    constructor() {
        this.createUserRepository = new create_repository_1.CreateUserRepository();
    }
    async execute(request) {
        if (request.cityId) {
            const city = await cities_1.CityModel.findByPk(request.cityId);
            if (!city) {
                throw new errors_1.NotFoundError('City not found');
            }
        }
        const user = await this.createUserRepository.create(request);
        // Registrar log de criação de usuário
        await logger_service_1.LoggerService.log('Criação de usuário', 'Minha Conta', user.id, `Usuário ${user.email} foi criado`);
        return { user };
    }
}
exports.CreateUserService = CreateUserService;
//# sourceMappingURL=create.service.js.map