"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAppointmentsRepository = void 0;
const sequelize_1 = require("sequelize");
const appointment_model_1 = require("@modules/appointments/model/appointment.model");
const user_model_1 = require("@modules/users/model/user.model");
class ListAppointmentsRepository {
    async findAll(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page - 1) * limit;
        const where = {};
        let userWhere;
        if (filters.name) {
            userWhere = {
                [sequelize_1.Op.or]: [
                    { firstName: { [sequelize_1.Op.like]: `%${filters.name}%` } },
                    { lastName: { [sequelize_1.Op.like]: `%${filters.name}%` } },
                    { email: { [sequelize_1.Op.like]: `%${filters.name}%` } },
                ],
            };
        }
        if (filters.room) {
            where.room = { [sequelize_1.Op.like]: `%${filters.room}%` };
        }
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.startDate || filters.endDate) {
            where.appointmentDate = {};
            if (filters.startDate) {
                where.appointmentDate[sequelize_1.Op.gte] = new Date(filters.startDate);
            }
            if (filters.endDate) {
                where.appointmentDate[sequelize_1.Op.lte] = new Date(filters.endDate);
            }
        }
        const { count, rows } = await appointment_model_1.AppointmentModel.findAndCountAll({
            where,
            include: [
                {
                    model: user_model_1.UserModel,
                    as: 'user',
                    where: userWhere,
                    attributes: {
                        exclude: ['password'],
                    },
                    required: !!userWhere,
                },
            ],
            limit,
            offset,
            order: [['appointmentDate', 'DESC']],
        });
        return {
            appointments: rows.map((appointment) => appointment.toJSON()),
            total: count,
        };
    }
}
exports.ListAppointmentsRepository = ListAppointmentsRepository;
//# sourceMappingURL=list.repository.js.map