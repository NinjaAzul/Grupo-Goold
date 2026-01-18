"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogRepository = void 0;
const sequelize_1 = require("sequelize");
const log_model_1 = require("../model/log.model");
const user_model_1 = require("@modules/users/model/user.model");
class LogRepository {
    /**
     * Lista logs com filtros e paginação
     */
    async findAll(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page - 1) * limit;
        const where = {};
        if (filters.userId !== undefined) {
            where.userId = filters.userId;
        }
        if (filters.activityType) {
            where.activityType = { [sequelize_1.Op.like]: `%${filters.activityType}%` };
        }
        if (filters.module) {
            where.module = { [sequelize_1.Op.like]: `%${filters.module}%` };
        }
        if (filters.startDate || filters.endDate) {
            where.createdAt = {};
            if (filters.startDate) {
                where.createdAt[sequelize_1.Op.gte] = new Date(filters.startDate);
            }
            if (filters.endDate) {
                where.createdAt[sequelize_1.Op.lte] = new Date(filters.endDate);
            }
        }
        const { count, rows } = await log_model_1.LogModel.findAndCountAll({
            where,
            include: [
                {
                    model: user_model_1.UserModel,
                    as: 'user',
                    attributes: {
                        exclude: ['password'],
                    },
                    required: false,
                },
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });
        return {
            logs: rows.map((log) => log.toJSON()),
            total: count,
        };
    }
}
exports.LogRepository = LogRepository;
//# sourceMappingURL=log.repository.js.map