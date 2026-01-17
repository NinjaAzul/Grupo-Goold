"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAppointmentsRepository = void 0;
const appointment_model_1 = require("@modules/appointments/model/appointment.model");
const user_model_1 = require("@modules/users/model/user.model");
const sequelize_1 = require("sequelize");
class ListAppointmentsRepository {
    async list(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page - 1) * limit;
        const where = {
            userId: filters.userId,
        };
        // Filtro por status
        if (filters.status) {
            where.status = filters.status;
        }
        // Filtro por data
        if (filters.startDate || filters.endDate) {
            where.appointmentDate = {};
            if (filters.startDate) {
                where.appointmentDate[sequelize_1.Op.gte] = new Date(filters.startDate);
            }
            if (filters.endDate) {
                const endDate = new Date(filters.endDate);
                endDate.setHours(23, 59, 59, 999);
                where.appointmentDate[sequelize_1.Op.lte] = endDate;
            }
        }
        // Filtro por nome/email (busca no próprio usuário)
        let userWhere = {};
        if (filters.name) {
            const searchTerm = `%${filters.name}%`;
            userWhere = {
                [sequelize_1.Op.or]: [
                    { firstName: { [sequelize_1.Op.like]: searchTerm } },
                    { lastName: { [sequelize_1.Op.like]: searchTerm } },
                    { email: { [sequelize_1.Op.like]: searchTerm } },
                ],
            };
        }
        const { rows, count } = await appointment_model_1.AppointmentModel.findAndCountAll({
            where,
            include: [
                {
                    model: user_model_1.UserModel,
                    as: 'user',
                    where: userWhere,
                    required: filters.name ? true : false,
                    attributes: {
                        exclude: ['password'],
                    },
                },
            ],
            limit,
            offset,
            order: [['appointmentDate', 'DESC']],
        });
        return {
            rows: rows.map((row) => row.toJSON()),
            count,
        };
    }
}
exports.ListAppointmentsRepository = ListAppointmentsRepository;
//# sourceMappingURL=list.repository.js.map