"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoomController = void 0;
const create_service_1 = require("./create.service");
class CreateRoomController {
    constructor() {
        this.service = new create_service_1.CreateRoomService();
    }
    async handle(req, res, next) {
        try {
            const result = await this.service.execute(req.body);
            return res.status(201).json(result);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.CreateRoomController = CreateRoomController;
//# sourceMappingURL=create.controller.js.map