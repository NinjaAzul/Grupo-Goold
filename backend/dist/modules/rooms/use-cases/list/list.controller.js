"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListRoomsController = void 0;
const list_service_1 = require("./list.service");
class ListRoomsController {
    constructor() {
        this.service = new list_service_1.ListRoomsService();
    }
    async handle(_req, res, next) {
        try {
            const rooms = await this.service.execute();
            return res.json({ success: true, data: rooms });
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.ListRoomsController = ListRoomsController;
//# sourceMappingURL=list.controller.js.map