"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoomRepository = void 0;
const room_model_1 = require("@modules/rooms/model/room.model");
const errors_1 = require("@shared/errors");
class UpdateRoomRepository {
    async update(roomId, data) {
        const room = await room_model_1.RoomModel.findByPk(roomId);
        if (!room) {
            throw new errors_1.NotFoundError('Room not found');
        }
        // Se está tentando atualizar o nome, verificar se já existe
        if (data.name && data.name !== room.name) {
            const existingRoom = await room_model_1.RoomModel.findOne({
                where: { name: data.name },
            });
            if (existingRoom) {
                throw new errors_1.BadRequestError('Room with this name already exists');
            }
        }
        await room.update({
            name: data.name ?? room.name,
            startTime: data.startTime ?? room.startTime,
            endTime: data.endTime ?? room.endTime,
            timeBlock: data.timeBlock ?? room.timeBlock,
        });
        return room.toJSON();
    }
}
exports.UpdateRoomRepository = UpdateRoomRepository;
//# sourceMappingURL=update.repository.js.map