"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAppointmentsController = void 0;
const list_service_1 = require("./list.service");
class ListAppointmentsController {
    constructor() {
        this.service = new list_service_1.ListAppointmentsService();
    }
    async handle(req, res, next) {
        try {
            const userId = req.user.id;
            const query = req.query;
            const result = await this.service.execute({
                userId,
                page: query.page || 1,
                limit: query.limit || 10,
                name: query.name,
                startDate: query.startDate,
                endDate: query.endDate,
                status: query.status,
            });
            return res.json(result);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.ListAppointmentsController = ListAppointmentsController;
//# sourceMappingURL=list.controller.js.map