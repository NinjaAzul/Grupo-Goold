"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUsersController = void 0;
const list_service_1 = require("./list.service");
class ListUsersController {
    constructor() {
        this.service = new list_service_1.ListUsersService();
    }
    async handle(req, res, next) {
        try {
            const query = req.query;
            const result = await this.service.execute(query);
            return res.json(result);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.ListUsersController = ListUsersController;
//# sourceMappingURL=list.controller.js.map