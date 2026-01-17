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
            const date = req.query.date;
            const roomId = req.query.roomId
                ? Number(req.query.roomId)
                : undefined;
            if (!date) {
                return res.status(400).json({
                    error: {
                        message: 'Date parameter is required (YYYY-MM-DD)',
                        statusCode: 400,
                    },
                });
            }
            const result = await this.service.execute({
                date,
                roomId,
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