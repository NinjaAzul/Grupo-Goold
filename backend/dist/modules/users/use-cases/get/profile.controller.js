"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProfileController = void 0;
const profile_service_1 = require("./profile.service");
class GetProfileController {
    constructor() {
        this.service = new profile_service_1.GetProfileService();
    }
    async handle(req, res, next) {
        try {
            const userId = req.user.id;
            const result = await this.service.execute(userId);
            return res.json(result);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.GetProfileController = GetProfileController;
//# sourceMappingURL=profile.controller.js.map