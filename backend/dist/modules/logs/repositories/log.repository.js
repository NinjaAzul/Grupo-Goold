"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogRepository = void 0;
const sequelize_1 = require("sequelize");
const log_model_1 = require("../model/log.model");
const user_model_1 = require("@modules/users/model/user.model");
class LogRepository {
    async findAll(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page - 1) * limit;
        const where = {};
        if (filters.userId !== undefined) {
            where.userId = filters.userId;
        }
        const hasActivityOrModule = filters.activityType || filters.module;
        const hasUserName = filters.userId === undefined && !!filters.userName;
        if (hasActivityOrModule && hasUserName) {
            const searchTerm = filters.activityType || filters.module || '';
            const searchWords = searchTerm
                .trim()
                .split(/\s+/)
                .filter((word) => word.length > 0);
            const userNameWords = filters
                .userName.trim()
                .split(/\s+/)
                .filter((word) => word.length > 0);
            const wordConditions = searchWords.map((word) => {
                const orConditions = [];
                if (filters.activityType) {
                    orConditions.push({ activityType: { [sequelize_1.Op.like]: `%${word}%` } });
                }
                if (filters.module) {
                    orConditions.push({ module: { [sequelize_1.Op.like]: `%${word}%` } });
                }
                userNameWords.forEach((userWord) => {
                    const escapedWord = userWord.replace(/'/g, "''");
                    orConditions.push(sequelize_1.Sequelize.literal(`(user.first_name LIKE '%${escapedWord}%' OR user.last_name LIKE '%${escapedWord}%')`));
                });
                if (orConditions.length === 0) {
                    return {};
                }
                if (orConditions.length === 1) {
                    return orConditions[0];
                }
                return { [sequelize_1.Op.or]: orConditions };
            });
            if (wordConditions.length > 0) {
                where[sequelize_1.Op.and] = wordConditions;
            }
        }
        else if (hasActivityOrModule) {
            const searchTerm = filters.activityType || filters.module || '';
            const searchWords = searchTerm
                .trim()
                .split(/\s+/)
                .filter((word) => word.length > 0);
            if (searchWords.length > 0) {
                const wordConditions = searchWords.map((word) => {
                    const orConditions = [];
                    if (filters.activityType) {
                        orConditions.push({ activityType: { [sequelize_1.Op.like]: `%${word}%` } });
                    }
                    if (filters.module) {
                        orConditions.push({ module: { [sequelize_1.Op.like]: `%${word}%` } });
                    }
                    if (orConditions.length === 0) {
                        return {};
                    }
                    if (orConditions.length === 1) {
                        return orConditions[0];
                    }
                    return { [sequelize_1.Op.or]: orConditions };
                });
                if (wordConditions.length > 0) {
                    where[sequelize_1.Op.and] = wordConditions;
                }
            }
        }
        let userWhere = undefined;
        if (hasUserName && !hasActivityOrModule) {
            const searchWords = filters
                .userName.trim()
                .split(/\s+/)
                .filter((word) => word.length > 0);
            if (searchWords.length > 0) {
                const wordConditions = searchWords.map((word) => ({
                    [sequelize_1.Op.or]: [
                        { firstName: { [sequelize_1.Op.like]: `%${word}%` } },
                        { lastName: { [sequelize_1.Op.like]: `%${word}%` } },
                    ],
                }));
                userWhere = {
                    [sequelize_1.Op.and]: wordConditions,
                };
            }
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
                    where: userWhere,
                    required: (hasActivityOrModule && hasUserName) || hasUserName,
                    attributes: {
                        exclude: ['password'],
                    },
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