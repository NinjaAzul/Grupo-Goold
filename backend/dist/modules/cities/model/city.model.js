"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityModel = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("@shared/config");
class CityModel extends sequelize_1.Model {
}
exports.CityModel = CityModel;
CityModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'id',
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        field: 'name',
    },
    stateId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'state_id',
    },
}, {
    sequelize: config_1.sequelize,
    tableName: 'cities',
    underscored: true,
    timestamps: true,
});
//# sourceMappingURL=city.model.js.map