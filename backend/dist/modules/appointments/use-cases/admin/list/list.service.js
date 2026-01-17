"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAppointmentsService = void 0;
const list_repository_1 = require("./list.repository");
class ListAppointmentsService {
    constructor() {
        this.repository = new list_repository_1.ListAppointmentsRepository();
    }
    async execute(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const { appointments, total } = await this.repository.findAll(filters);
        const totalPages = Math.ceil(total / limit);
        return {
            success: true,
            data: appointments,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        };
    }
}
exports.ListAppointmentsService = ListAppointmentsService;
//# sourceMappingURL=list.service.js.map