"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateModel = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("@shared/config");
class StateModel extends sequelize_1.Model {
}
exports.StateModel = StateModel;
StateModel.init({
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
    uf: {
        type: sequelize_1.DataTypes.STRING(2),
        allowNull: false,
        unique: true,
        field: 'uf',
    },
}, {
    sequelize: config_1.sequelize,
    tableName: 'states',
    underscored: true,
    timestamps: true,
});
//# sourceMappingURL=state.model.js.map