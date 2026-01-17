"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserController = void 0;
const update_service_1 = require("./update.service");
class UpdateUserController {
    constructor() {
        this.service = new update_service_1.UpdateUserService();
    }
    async handle(req, res, next) {
        try {
            const userId = Number(req.params.id);
            const updateData = req.body;
            const result = await this.service.execute({
                userId,
                ...updateData,
            });
            return res.json(result);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.UpdateUserController = UpdateUserController;
//# sourceMappingURL=update.controller.js.map