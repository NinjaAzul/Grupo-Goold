"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyLogsController = void 0;
const list_service_1 = require("../list/list.service");
class MyLogsController {
    constructor() {
        this.service = new list_service_1.ListLogsService();
    }
    async handle(req, res, next) {
        try {
            const userId = req.user.id;
            const query = req.query;
            const result = await this.service.execute({
                userId,
                ...query,
            });
            return res.json(result);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.MyLogsController = MyLogsController;
//# sourceMappingURL=my-logs.controller.js.map