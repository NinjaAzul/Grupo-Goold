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
            const query = req.query;
            const result = await this.service.execute(query);
            return res.json(result);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.ListLogsController = ListLogsController;
//# sourceMappingURL=list.controller.js.map