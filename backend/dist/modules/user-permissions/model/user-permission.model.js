"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPermissionModel = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("@shared/config");
class UserPermissionModel extends sequelize_1.Model {
}
exports.UserPermissionModel = UserPermissionModel;
UserPermissionModel.init({
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // Parte da chave primária composta
        field: 'user_id',
    },
    permissionId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // Parte da chave primária composta
        field: 'permission_id',
    },
    granted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'granted',
    },
}, {
    sequelize: config_1.sequelize,
    tableName: 'user_permissions',
    underscored: true,
    timestamps: true,
});
//# sourceMappingURL=user-permission.model.js.map