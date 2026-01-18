"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoomService = void 0;
const room_repository_1 = require("../../repositories/room.repository");
const errors_1 = require("@shared/errors");
const room_model_1 = require("@modules/rooms/model/room.model");
class CreateRoomService {
    constructor() {
        this.roomRepository = new room_repository_1.RoomRepository();
    }
    async execute(request) {
        const existingRoom = await room_model_1.RoomModel.findOne({
            where: { name: request.name },
        });
        if (existingRoom) {
            throw new errors_1.BadRequestError('Já existe uma sala com este nome');
        }
        const room = await this.roomRepository.create(request);
        if (!room) {
            throw new Error('Falha ao criar sala');
        }
        return { room };
    }
}
exports.CreateRoomService = CreateRoomService;
//# sourceMappingURL=create.service.js.map