"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionModel = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("@shared/config");
class PermissionModel extends sequelize_1.Model {
}
exports.PermissionModel = PermissionModel;
PermissionModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        field: 'name',
    },
}, {
    sequelize: config_1.sequelize,
    tableName: 'permissions',
    underscored: true,
    timestamps: true,
});
//# sourceMappingURL=permission.model.js.map