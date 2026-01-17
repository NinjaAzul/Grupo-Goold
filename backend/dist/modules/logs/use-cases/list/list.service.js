"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListLogsService = void 0;
const list_repository_1 = require("./list.repository");
class ListLogsService {
    constructor() {
        this.repository = new list_repository_1.ListLogsRepository();
    }
    async execute(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const { logs, total } = await this.repository.findAll(filters);
        const totalPages = Math.ceil(total / limit);
        return {
            success: true,
            data: logs,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        };
    }
}
exports.ListLogsService = ListLogsService;
//# sourceMappingURL=list.service.js.map