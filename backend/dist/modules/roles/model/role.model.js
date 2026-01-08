"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModel = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("@shared/config");
class RoleModel extends sequelize_1.Model {
}
exports.RoleModel = RoleModel;
RoleModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'name',
    },
}, {
    sequelize: config_1.sequelize,
    tableName: 'roles',
    underscored: true,
    timestamps: true,
});
//# sourceMappingURL=role.model.js.map