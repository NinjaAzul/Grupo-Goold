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
            // O userId vem do middleware ensureAuthenticated através do req.user
            const userId = req.user.id;
            const filters = {
                userId,
                page: req.query.page ? Number(req.query.page) : undefined,
                limit: req.query.limit ? Number(req.query.limit) : undefined,
                activityType: req.query.activityType,
                module: req.query.module,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            };
            const result = await this.service.execute(filters);
            return res.json(result);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.MyLogsController = MyLogsController;
//# sourceMappingURL=my-logs.controller.js.map