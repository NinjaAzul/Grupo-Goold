"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoomService = void 0;
const create_repository_1 = require("./create.repository");
class CreateRoomService {
    constructor() {
        this.repository = new create_repository_1.CreateRoomRepository();
    }
    async execute(request) {
        const room = await this.repository.create(request);
        return { room };
    }
}
exports.CreateRoomService = CreateRoomService;
//# sourceMappingURL=create.service.js.map