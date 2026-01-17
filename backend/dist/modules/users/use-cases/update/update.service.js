"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserService = void 0;
const update_repository_1 = require("./update.repository");
const logger_service_1 = require("@shared/utils/logger.service");
class UpdateUserService {
    constructor() {
        this.repository = new update_repository_1.UpdateUserRepository();
    }
    async execute(request) {
        const user = await this.repository.update(request);
        // Determinar tipo de atividade baseado no que foi alterado
        let activityType = 'Atualização de perfil';
        if (request.email) {
            activityType = 'Atualização de e-mail';
        }
        else if (request.password) {
            activityType = 'Atualização de senha';
        }
        // Registrar log de atualização
        await logger_service_1.LoggerService.log(activityType, 'Minha Conta', user.id, `Usuário ${user.email} atualizou ${activityType.toLowerCase()}`);
        return { user };
    }
}
exports.UpdateUserService = UpdateUserService;
//# sourceMappingURL=update.service.js.map