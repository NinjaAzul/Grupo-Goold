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
            const filters = {
                page: req.query.page ? Number(req.query.page) : undefined,
                limit: req.query.limit ? Number(req.query.limit) : undefined,
                name: req.query.name,
                room: req.query.room,
                status: req.query.status,
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
exports.ListAppointmentsController = ListAppointmentsController;
//# sourceMappingURL=list.controller.js.map