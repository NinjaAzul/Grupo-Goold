"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoomController = void 0;
const update_service_1 = require("./update.service");
class UpdateRoomController {
    constructor() {
        this.service = new update_service_1.UpdateRoomService();
    }
    async handle(req, res, next) {
        try {
            const roomId = Number(req.params.id);
            const result = await this.service.execute(roomId, req.body);
            return res.json({ success: true, data: result });
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.UpdateRoomController = UpdateRoomController;
//# sourceMappingURL=update.controller.js.map