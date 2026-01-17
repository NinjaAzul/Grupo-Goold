"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteRoomRepository = void 0;
const room_model_1 = require("@modules/rooms/model/room.model");
const errors_1 = require("@shared/errors");
const appointment_model_1 = require("@modules/appointments/model/appointment.model");
class DeleteRoomRepository {
    async delete(roomId) {
        const room = await room_model_1.RoomModel.findByPk(roomId);
        if (!room) {
            throw new errors_1.NotFoundError('Room not found');
        }
        // Verificar se há agendamentos associados a esta sala
        const appointmentsCount = await appointment_model_1.AppointmentModel.count({
            where: { room: room.name },
        });
        if (appointmentsCount > 0) {
            throw new errors_1.BadRequestError(`Cannot delete room. There are ${appointmentsCount} appointment(s) associated with this room.`);
        }
        await room.destroy();
    }
}
exports.DeleteRoomRepository = DeleteRoomRepository;
//# sourceMappingURL=delete.repository.js.map