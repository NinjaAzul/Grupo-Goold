"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentModel = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("@shared/config");
const appointment_interface_1 = require("./appointment.interface");
class AppointmentModel extends sequelize_1.Model {
}
exports.AppointmentModel = AppointmentModel;
AppointmentModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
    },
    appointmentDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: 'appointment_date',
    },
    roomId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'room_id',
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'scheduled', 'cancelled'),
        allowNull: false,
        defaultValue: appointment_interface_1.AppointmentStatus.PENDING,
        field: 'status',
    },
}, {
    sequelize: config_1.sequelize,
    tableName: 'appointments',
    underscored: true,
    timestamps: true,
});
//# sourceMappingURL=appointment.model.js.map