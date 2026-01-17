"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserRepository = void 0;
const user_model_1 = require("@modules/users/model/user.model");
const errors_1 = require("@shared/errors");
const appointment_model_1 = require("@modules/appointments/model/appointment.model");
const constants_1 = require("@shared/constants");
class DeleteUserRepository {
    async delete(userId) {
        const user = await user_model_1.UserModel.findByPk(userId);
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        // Não permitir deletar o último admin
        if (user.roleId === constants_1.ROLES.ADMIN) {
            const adminCount = await user_model_1.UserModel.count({
                where: { roleId: constants_1.ROLES.ADMIN },
            });
            if (adminCount === 1) {
                throw new errors_1.BadRequestError('Cannot delete the last admin user. At least one admin must exist.');
            }
        }
        // Verificar se há agendamentos associados
        const appointmentsCount = await appointment_model_1.AppointmentModel.count({
            where: { userId },
        });
        if (appointmentsCount > 0) {
            throw new errors_1.BadRequestError(`Cannot delete user. There are ${appointmentsCount} appointment(s) associated with this user.`);
        }
        await user.destroy();
    }
}
exports.DeleteUserRepository = DeleteUserRepository;
//# sourceMappingURL=delete.repository.js.map