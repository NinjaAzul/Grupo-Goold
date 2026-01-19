"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListLogsService = void 0;
const log_repository_1 = require("../../repositories/log.repository");
const date_helper_1 = require("@shared/utils/date.helper");
class ListLogsService {
    constructor() {
        this.logRepository = new log_repository_1.LogRepository();
    }
    async execute(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const { logs, total } = await this.logRepository.findAll(filters);
        const totalPages = Math.ceil(total / limit);
        return {
            success: true,
            data: date_helper_1.DateHelper.normalizeDatesInObject(logs),
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