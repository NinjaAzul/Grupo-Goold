"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("@shared/config");
const constants_1 = require("@shared/constants");
class UserModel extends sequelize_1.Model {
}
exports.UserModel = UserModel;
UserModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        field: 'first_name',
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        field: 'last_name',
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        field: 'password',
    },
    zipCode: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
        field: 'zip_code',
    },
    street: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        field: 'street',
    },
    number: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
        field: 'number',
    },
    complement: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        field: 'complement',
    },
    neighborhood: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
        field: 'neighborhood',
    },
    cityId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        field: 'city_id',
    },
    roleId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: constants_1.ROLES.USER,
        field: 'role_id',
    },
}, {
    sequelize: config_1.sequelize,
    tableName: 'users',
    underscored: true,
    timestamps: true,
});
//# sourceMappingURL=user.model.js.map