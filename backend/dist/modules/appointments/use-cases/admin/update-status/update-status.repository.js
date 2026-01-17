"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStatusRepository = void 0;
const appointment_model_1 = require("@modules/appointments/model/appointment.model");
const user_model_1 = require("@modules/users/model/user.model");
const errors_1 = require("@shared/errors");
class UpdateStatusRepository {
    async updateStatus(appointmentId, status) {
        const appointment = await appointment_model_1.AppointmentModel.findByPk(appointmentId, {
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
        appointment.status = status;
        await appointment.save();
        return appointment.toJSON();
    }
}
exports.UpdateStatusRepository = UpdateStatusRepository;
//# sourceMappingURL=update-status.repository.js.map