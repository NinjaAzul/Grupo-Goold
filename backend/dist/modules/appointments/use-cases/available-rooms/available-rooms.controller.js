"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableRoomsController = void 0;
const available_rooms_service_1 = require("./available-rooms.service");
class AvailableRoomsController {
    constructor() {
        this.service = new available_rooms_service_1.AvailableRoomsService();
    }
    async handle(req, res, next) {
        try {
            const query = req.query;
            const result = await this.service.execute({
                date: query.date,
                time: query.time,
            });
            return res.json(result);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.AvailableRoomsController = AvailableRoomsController;
//# sourceMappingURL=available-rooms.controller.js.map