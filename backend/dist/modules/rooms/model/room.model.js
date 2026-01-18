"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomModel = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("@shared/config");
class RoomModel extends sequelize_1.Model {
}
exports.RoomModel = RoomModel;
RoomModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        field: 'name',
    },
    startTime: {
        type: sequelize_1.DataTypes.STRING(5),
        allowNull: false,
        field: 'start_time',
        validate: {
            is: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
        },
    },
    endTime: {
        type: sequelize_1.DataTypes.STRING(5),
        allowNull: false,
        field: 'end_time',
        validate: {
            is: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
        },
    },
    timeBlock: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'time_block',
        comment: 'Bloco de horários em minutos (ex: 30, 60)',
    },
}, {
    sequelize: config_1.sequelize,
    tableName: 'rooms',
    underscored: true,
    timestamps: true,
});
//# sourceMappingURL=room.model.js.map