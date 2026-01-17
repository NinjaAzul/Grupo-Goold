"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserController = void 0;
const delete_service_1 = require("./delete.service");
class DeleteUserController {
    constructor() {
        this.service = new delete_service_1.DeleteUserService();
    }
    async handle(req, res, next) {
        try {
            const userId = Number(req.params.id);
            await this.service.execute(userId);
            return res.status(204).send();
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.DeleteUserController = DeleteUserController;
//# sourceMappingURL=delete.controller.js.map