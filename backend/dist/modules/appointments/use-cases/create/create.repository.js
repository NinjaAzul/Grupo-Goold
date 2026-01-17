"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAppointmentRepository = void 0;
const appointment_model_1 = require("@modules/appointments/model/appointment.model");
const user_model_1 = require("@modules/users/model/user.model");
const appointment_interface_1 = require("@modules/appointments/model/appointment.interface");
class CreateAppointmentRepository {
    async create(data) {
        const appointment = await appointment_model_1.AppointmentModel.create({
            userId: data.userId,
            appointmentDate: data.appointmentDate,
            room: data.room,
            status: appointment_interface_1.AppointmentStatus.PENDING,
        });
        const appointmentWithUser = await appointment_model_1.AppointmentModel.findByPk(appointment.id, {
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
        if (!appointmentWithUser) {
            throw new Error('Failed to create appointment');
        }
        return appointmentWithUser.toJSON();
    }
}
exports.CreateAppointmentRepository = CreateAppointmentRepository;
//# sourceMappingURL=create.repository.js.map