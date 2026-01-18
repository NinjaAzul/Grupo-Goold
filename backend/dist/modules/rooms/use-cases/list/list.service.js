"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListRoomsService = void 0;
const room_repository_1 = require("../../repositories/room.repository");
class ListRoomsService {
    constructor() {
        this.roomRepository = new room_repository_1.RoomRepository();
    }
    async execute() {
        return await this.roomRepository.findAll();
    }
}
exports.ListRoomsService = ListRoomsService;
//# sourceMappingURL=list.service.js.map