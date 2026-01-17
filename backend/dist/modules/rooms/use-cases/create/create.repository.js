"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoomRepository = void 0;
const room_model_1 = require("@modules/rooms/model/room.model");
const errors_1 = require("@shared/errors");
class CreateRoomRepository {
    async create(data) {
        // Verificar se já existe uma sala com o mesmo nome
        const existingRoom = await room_model_1.RoomModel.findOne({
            where: { name: data.name },
        });
        if (existingRoom) {
            throw new errors_1.BadRequestError('Room with this name already exists');
        }
        const room = await room_model_1.RoomModel.create({
            name: data.name,
            startTime: data.startTime,
            endTime: data.endTime,
            timeBlock: data.timeBlock,
        });
        return room.toJSON();
    }
}
exports.CreateRoomRepository = CreateRoomRepository;
//# sourceMappingURL=create.repository.js.map