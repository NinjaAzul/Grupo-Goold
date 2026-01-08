"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityModel = exports.StateModel = exports.RoleModel = exports.UserModel = void 0;
// Centralized model exports and associations
const user_model_1 = require("@modules/users/model/user.model");
Object.defineProperty(exports, "UserModel", { enumerable: true, get: function () { return user_model_1.UserModel; } });
const roles_1 = require("@modules/roles");
Object.defineProperty(exports, "RoleModel", { enumerable: true, get: function () { return roles_1.RoleModel; } });
const state_model_1 = require("@modules/states/model/state.model");
Object.defineProperty(exports, "StateModel", { enumerable: true, get: function () { return state_model_1.StateModel; } });
const city_model_1 = require("@modules/cities/model/city.model");
Object.defineProperty(exports, "CityModel", { enumerable: true, get: function () { return city_model_1.CityModel; } });
// Definir relacionamentos User-Role
user_model_1.UserModel.belongsTo(roles_1.RoleModel, {
    foreignKey: 'role_id',
    as: 'role',
});
roles_1.RoleModel.hasMany(user_model_1.UserModel, {
    foreignKey: 'role_id',
    as: 'users',
});
// Definir relacionamentos State-City
city_model_1.CityModel.belongsTo(state_model_1.StateModel, {
    foreignKey: 'state_id',
    as: 'state',
});
state_model_1.StateModel.hasMany(city_model_1.CityModel, {
    foreignKey: 'state_id',
    as: 'cities',
});
// Definir relacionamentos User-City
user_model_1.UserModel.belongsTo(city_model_1.CityModel, {
    foreignKey: 'city_id',
    as: 'city',
});
city_model_1.CityModel.hasMany(user_model_1.UserModel, {
    foreignKey: 'city_id',
    as: 'users',
});
//# sourceMappingURL=models.js.map