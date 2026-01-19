"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentRepository = void 0;
const sequelize_1 = require("sequelize");
const appointment_model_1 = require("../model/appointment.model");
const user_model_1 = require("@modules/users/model/user.model");
const room_model_1 = require("@modules/rooms/model/room.model");
const appointment_interface_1 = require("../model/appointment.interface");
class AppointmentRepository {
    async create(data) {
        if (!data.roomId) {
            throw new Error('roomId is required');
        }
        const appointment = await appointment_model_1.AppointmentModel.create({
            userId: data.userId,
            appointmentDate: data.appointmentDate,
            roomId: data.roomId,
            status: appointment_interface_1.AppointmentStatus.PENDING,
        });
        const appointmentWithRelations = await appointment_model_1.AppointmentModel.findByPk(appointment.id, {
            include: [
                {
                    model: user_model_1.UserModel,
                    as: 'user',
                    attributes: {
                        exclude: ['password'],
                    },
                },
                {
                    model: room_model_1.RoomModel,
                    as: 'room',
                    required: true,
                },
            ],
        });
        if (!appointmentWithRelations) {
            return null;
        }
        return appointmentWithRelations.toJSON();
    }
    async findAll(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page - 1) * limit;
        const where = {
            userId: filters.userId,
        };
        if (filters.status) {
            where.status = filters.status;
        }
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
        let userWhere = undefined;
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
                {
                    model: room_model_1.RoomModel,
                    as: 'room',
                    required: true,
                },
            ],
            limit,
            offset,
            order: [['appointmentDate', 'DESC']],
        });
        return {
            rows: rows.map((row) => {
                const appointment = row.toJSON();
                return appointment;
            }),
            count,
        };
    }
    async findAllAdmin(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page - 1) * limit;
        const where = {};
        let userWhere;
        let roomWhere;
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
            roomWhere = {
                name: { [sequelize_1.Op.like]: `%${filters.room}%` },
            };
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
                const endDate = new Date(filters.endDate);
                endDate.setHours(23, 59, 59, 999);
                where.appointmentDate[sequelize_1.Op.lte] = endDate;
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
                {
                    model: room_model_1.RoomModel,
                    as: 'room',
                    where: roomWhere,
                    required: true,
                },
            ],
            limit,
            offset,
            order: [['appointmentDate', 'DESC']],
        });
        return {
            appointments: rows.map((row) => row.toJSON()),
            total: count,
        };
    }
    async getRooms(roomId) {
        const roomsWhere = {};
        if (roomId) {
            roomsWhere.id = roomId;
        }
        return await room_model_1.RoomModel.findAll({
            where: roomsWhere,
        });
    }
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
                {
                    model: room_model_1.RoomModel,
                    as: 'room',
                    required: true,
                },
            ],
        });
        if (!appointment) {
            return null;
        }
        appointment.status = status;
        await appointment.save();
        return appointment.toJSON();
    }
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
                {
                    model: room_model_1.RoomModel,
                    as: 'room',
                    required: true,
                },
            ],
        });
        if (!appointment) {
            return null;
        }
        appointment.status = appointment_interface_1.AppointmentStatus.CANCELLED;
        await appointment.save();
        return appointment.toJSON();
    }
}
exports.AppointmentRepository = AppointmentRepository;
//# sourceMappingURL=appointment.repository.js.map