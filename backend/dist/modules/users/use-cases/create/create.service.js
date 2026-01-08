"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserService = void 0;
const create_repository_1 = require("./create.repository");
const errors_1 = require("@shared/errors");
const roles_1 = require("@modules/roles");
const cities_1 = require("@modules/cities");
class CreateUserService {
    constructor() {
        this.createUserRepository = new create_repository_1.CreateUserRepository();
    }
    async execute(request) {
        // Validação de negócio: verificar se a role existe (se fornecido)
        if (request.roleId) {
            const role = await roles_1.RoleModel.findByPk(request.roleId);
            if (!role) {
                throw new errors_1.NotFoundError('Role not found');
            }
        }
        // Validação de negócio: verificar se a city existe (se fornecido)
        if (request.cityId) {
            const city = await cities_1.CityModel.findByPk(request.cityId);
            if (!city) {
                throw new errors_1.NotFoundError('City not found');
            }
        }
        const user = await this.createUserRepository.create(request);
        return { user };
    }
}
exports.CreateUserService = CreateUserService;
//# sourceMappingURL=create.service.js.map