"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAppointmentsService = void 0;
const list_repository_1 = require("./list.repository");
class ListAppointmentsService {
    constructor() {
        this.repository = new list_repository_1.ListAppointmentsRepository();
    }
    async execute(request) {
        const { rows, count } = await this.repository.list(request);
        const page = request.page || 1;
        const limit = request.limit || 10;
        const totalPages = Math.ceil(count / limit);
        return {
            success: true,
            data: rows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages,
            },
        };
    }
}
exports.ListAppointmentsService = ListAppointmentsService;
//# sourceMappingURL=list.service.js.map