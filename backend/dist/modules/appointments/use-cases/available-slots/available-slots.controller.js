"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableSlotsController = void 0;
const available_slots_service_1 = require("./available-slots.service");
class AvailableSlotsController {
    constructor() {
        this.service = new available_slots_service_1.AvailableSlotsService();
    }
    async handle(req, res, next) {
        try {
            const query = req.query;
            const result = await this.service.execute({
                date: query.date,
                roomId: query.roomId,
            });
            return res.json(result);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.AvailableSlotsController = AvailableSlotsController;
//# sourceMappingURL=available-slots.controller.js.map