"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoomService = void 0;
const room_repository_1 = require("../../repositories/room.repository");
const errors_1 = require("@shared/errors");
const room_model_1 = require("@modules/rooms/model/room.model");
class UpdateRoomService {
    constructor() {
        this.roomRepository = new room_repository_1.RoomRepository();
    }
    async execute(roomId, data) {
        const room = await room_model_1.RoomModel.findByPk(roomId);
        if (!room) {
            throw new errors_1.NotFoundError('Sala não encontrada');
        }
        if (data.name && data.name !== room.name) {
            const existingRoom = await room_model_1.RoomModel.findOne({
                where: { name: data.name },
            });
            if (existingRoom) {
                throw new errors_1.BadRequestError('Já existe uma sala com este nome');
            }
        }
        const updatedRoom = await this.roomRepository.update(roomId, data);
        if (!updatedRoom) {
            throw new errors_1.NotFoundError('Sala não encontrada');
        }
        return updatedRoom;
    }
}
exports.UpdateRoomService = UpdateRoomService;
//# sourceMappingURL=update.service.js.map