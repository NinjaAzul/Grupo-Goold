"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminListAppointmentsController = void 0;
const admin_list_service_1 = require("./admin-list.service");
class AdminListAppointmentsController {
    constructor() {
        this.service = new admin_list_service_1.AdminListAppointmentsService();
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
exports.AdminListAppointmentsController = AdminListAppointmentsController;
//# sourceMappingURL=admin-list.controller.js.map