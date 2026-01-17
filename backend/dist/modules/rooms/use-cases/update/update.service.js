"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoomService = void 0;
const update_repository_1 = require("./update.repository");
class UpdateRoomService {
    constructor() {
        this.repository = new update_repository_1.UpdateRoomRepository();
    }
    async execute(roomId, data) {
        return await this.repository.update(roomId, data);
    }
}
exports.UpdateRoomService = UpdateRoomService;
//# sourceMappingURL=update.service.js.map