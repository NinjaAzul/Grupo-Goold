"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomRepository = void 0;
const room_model_1 = require("../model/room.model");
const appointment_model_1 = require("@modules/appointments/model/appointment.model");
class RoomRepository {
    async create(data) {
        const room = await room_model_1.RoomModel.create({
            name: data.name,
            startTime: data.startTime,
            endTime: data.endTime,
            timeBlock: data.timeBlock,
        });
        return room ? room.toJSON() : null;
    }
    async findAll() {
        const rooms = await room_model_1.RoomModel.findAll({
            order: [['name', 'ASC']],
        });
        return rooms.map((room) => room.toJSON());
    }
    async findById(roomId) {
        const room = await room_model_1.RoomModel.findByPk(roomId);
        return room ? room.toJSON() : null;
    }
    async update(roomId, data) {
        const room = await room_model_1.RoomModel.findByPk(roomId);
        if (!room) {
            return null;
        }
        await room.update({
            name: data.name ?? room.name,
            startTime: data.startTime ?? room.startTime,
            endTime: data.endTime ?? room.endTime,
            timeBlock: data.timeBlock ?? room.timeBlock,
        });
        return room.toJSON();
    }
    async delete(roomId) {
        const room = await room_model_1.RoomModel.findByPk(roomId);
        if (!room) {
            return false;
        }
        await room.destroy();
        return true;
    }
    async countAppointmentsByRoomName(roomName) {
        return await appointment_model_1.AppointmentModel.count({
            where: { room: roomName },
        });
    }
}
exports.RoomRepository = RoomRepository;
//# sourceMappingURL=room.repository.js.map