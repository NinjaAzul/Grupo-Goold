"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteRoomService = void 0;
const delete_repository_1 = require("./delete.repository");
class DeleteRoomService {
    constructor() {
        this.repository = new delete_repository_1.DeleteRoomRepository();
    }
    async execute(roomId) {
        await this.repository.delete(roomId);
    }
}
exports.DeleteRoomService = DeleteRoomService;
//# sourceMappingURL=delete.service.js.map