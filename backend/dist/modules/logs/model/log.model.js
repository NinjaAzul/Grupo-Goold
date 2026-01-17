"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogModel = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("@shared/config");
class LogModel extends sequelize_1.Model {
}
exports.LogModel = LogModel;
LogModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        field: 'user_id',
    },
    activityType: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        field: 'activity_type',
    },
    module: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        field: 'module',
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        field: 'description',
    },
}, {
    sequelize: config_1.sequelize,
    tableName: 'logs',
    underscored: true,
    timestamps: true,
    updatedAt: false, // Logs são imutáveis, apenas created_at
});
//# sourceMappingURL=log.model.js.map