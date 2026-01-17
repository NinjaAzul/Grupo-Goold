"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteRoomController = void 0;
const delete_service_1 = require("./delete.service");
class DeleteRoomController {
    constructor() {
        this.service = new delete_service_1.DeleteRoomService();
    }
    async handle(req, res, next) {
        try {
            const roomId = Number(req.params.id);
            await this.service.execute(roomId);
            return res.status(204).send();
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.DeleteRoomController = DeleteRoomController;
//# sourceMappingURL=delete.controller.js.map