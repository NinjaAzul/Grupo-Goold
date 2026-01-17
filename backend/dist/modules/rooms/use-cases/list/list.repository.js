"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListRoomsRepository = void 0;
const room_model_1 = require("@modules/rooms/model/room.model");
class ListRoomsRepository {
    async findAll() {
        const rooms = await room_model_1.RoomModel.findAll({
            order: [['name', 'ASC']],
        });
        return rooms.map((room) => room.toJSON());
    }
}
exports.ListRoomsRepository = ListRoomsRepository;
//# sourceMappingURL=list.repository.js.map