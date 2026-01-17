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
            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const name = req.query.name;
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;
            const status = req.query.status;
            const result = await this.service.execute({
                userId,
                page,
                limit,
                name,
                startDate,
                endDate,
                status,
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