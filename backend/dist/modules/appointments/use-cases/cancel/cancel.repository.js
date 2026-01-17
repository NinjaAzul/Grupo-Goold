"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelAppointmentRepository = void 0;
const appointment_model_1 = require("@modules/appointments/model/appointment.model");
const user_model_1 = require("@modules/users/model/user.model");
const appointment_interface_1 = require("@modules/appointments/model/appointment.interface");
const errors_1 = require("@shared/errors");
class CancelAppointmentRepository {
    async cancel(request) {
        const appointment = await appointment_model_1.AppointmentModel.findByPk(request.appointmentId, {
            include: [
                {
                    model: user_model_1.UserModel,
                    as: 'user',
                    attributes: {
                        exclude: ['password'],
                    },
                },
            ],
        });
        if (!appointment) {
            throw new errors_1.NotFoundError('Appointment not found');
        }
        // Verificar se o usuário é o dono do agendamento
        if (appointment.userId !== request.userId) {
            throw new errors_1.ForbiddenError('You can only cancel your own appointments');
        }
        // Verificar se já está cancelado
        if (appointment.status === appointment_interface_1.AppointmentStatus.CANCELLED) {
            throw new errors_1.ForbiddenError('Appointment is already cancelled');
        }
        appointment.status = appointment_interface_1.AppointmentStatus.CANCELLED;
        await appointment.save();
        return appointment.toJSON();
    }
}
exports.CancelAppointmentRepository = CancelAppointmentRepository;
//# sourceMappingURL=cancel.repository.js.map