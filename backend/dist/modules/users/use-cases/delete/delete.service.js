"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserService = void 0;
const delete_repository_1 = require("./delete.repository");
const logger_service_1 = require("@shared/utils/logger.service");
const user_model_1 = require("@modules/users/model/user.model");
class DeleteUserService {
    constructor() {
        this.repository = new delete_repository_1.DeleteUserRepository();
    }
    async execute(userId) {
        // Buscar dados do usuário antes de deletar para o log
        const user = await user_model_1.UserModel.findByPk(userId);
        const userEmail = user?.email || 'N/A';
        await this.repository.delete(userId);
        // Registrar log de deleção (sem userId pois o usuário foi deletado)
        await logger_service_1.LoggerService.log('Exclusão de usuário', 'Minha Conta', null, `Usuário ${userEmail} foi excluído`);
    }
}
exports.DeleteUserService = DeleteUserService;
//# sourceMappingURL=delete.service.js.map