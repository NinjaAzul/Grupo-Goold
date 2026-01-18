"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileController = void 0;
const update_service_1 = require("../update/update.service");
class UpdateProfileController {
    constructor() {
        this.service = new update_service_1.UpdateUserService();
    }
    async handle(req, res, next) {
        try {
            const userId = req.user.id;
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
exports.UpdateProfileController = UpdateProfileController;
//# sourceMappingURL=update-profile.controller.js.map