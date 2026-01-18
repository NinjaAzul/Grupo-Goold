"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserService = void 0;
const user_repository_1 = require("../../repositories/user.repository");
const logger_service_1 = require("@shared/utils/logger.service");
const errors_1 = require("@shared/errors");
const user_model_1 = require("@modules/users/model/user.model");
const appointment_model_1 = require("@modules/appointments/model/appointment.model");
const constants_1 = require("@/@shared/constants");
class DeleteUserService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    async execute(userId) {
        const user = await user_model_1.UserModel.findByPk(userId);
        if (!user) {
            throw new errors_1.NotFoundError('Usuário não encontrado');
        }
        if (user.roleId === constants_1.ROLES.ADMIN) {
            const adminCount = await user_model_1.UserModel.count({
                where: { roleId: constants_1.ROLES.ADMIN },
            });
            if (adminCount === 1) {
                throw new errors_1.BadRequestError('Não é possível excluir o último usuário administrador. Deve existir pelo menos um administrador.');
            }
        }
        const appointmentsCount = await appointment_model_1.AppointmentModel.count({
            where: { userId },
        });
        if (appointmentsCount > 0) {
            throw new errors_1.BadRequestError(`Não é possível excluir o usuário. Existem ${appointmentsCount} agendamento(s) associados a este usuário.`);
        }
        const deleted = await this.userRepository.delete(userId);
        if (!deleted) {
            throw new errors_1.NotFoundError('Usuário não encontrado');
        }
        await logger_service_1.LoggerService.log('Exclusão de usuário', 'Minha Conta', userId, `Usuário ${user.email} foi excluído`);
    }
}
exports.DeleteUserService = DeleteUserService;
//# sourceMappingURL=delete.service.js.map