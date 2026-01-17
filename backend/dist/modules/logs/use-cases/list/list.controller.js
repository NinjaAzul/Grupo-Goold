"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListLogsController = void 0;
const list_service_1 = require("./list.service");
class ListLogsController {
    constructor() {
        this.service = new list_service_1.ListLogsService();
    }
    async handle(req, res, next) {
        try {
            const filters = {
                page: req.query.page ? Number(req.query.page) : undefined,
                limit: req.query.limit ? Number(req.query.limit) : undefined,
                userId: req.query.userId ? Number(req.query.userId) : undefined,
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
exports.ListLogsController = ListLogsController;
//# sourceMappingURL=list.controller.js.map