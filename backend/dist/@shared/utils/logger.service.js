"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const log_model_1 = require("@modules/logs/model/log.model");
const logger_1 = require("./logger");
class LoggerService {
    static async createLog(params) {
        try {
            await log_model_1.LogModel.create({
                userId: params.userId ?? null,
                activityType: params.activityType,
                module: params.module,
                description: params.description ?? null,
            });
        }
        catch (error) {
            logger_1.logger.error('Error creating log:', error);
        }
    }
    static async log(activityType, module, userId, description) {
        await this.createLog({
            userId,
            activityType,
            module,
            description,
        });
    }
}
exports.LoggerService = LoggerService;
//# sourceMappingURL=logger.service.js.map