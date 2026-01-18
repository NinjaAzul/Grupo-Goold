"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomModel = exports.LogModel = exports.AppointmentModel = exports.CityModel = exports.StateModel = exports.UserPermissionModel = exports.PermissionModel = exports.RoleModel = exports.UserModel = void 0;
const user_model_1 = require("@modules/users/model/user.model");
Object.defineProperty(exports, "UserModel", { enumerable: true, get: function () { return user_model_1.UserModel; } });
const roles_1 = require("@modules/roles");
Object.defineProperty(exports, "RoleModel", { enumerable: true, get: function () { return roles_1.RoleModel; } });
const permissions_1 = require("@modules/permissions");
Object.defineProperty(exports, "PermissionModel", { enumerable: true, get: function () { return permissions_1.PermissionModel; } });
const user_permissions_1 = require("@modules/user-permissions");
Object.defineProperty(exports, "UserPermissionModel", { enumerable: true, get: function () { return user_permissions_1.UserPermissionModel; } });
const state_model_1 = require("@modules/states/model/state.model");
Object.defineProperty(exports, "StateModel", { enumerable: true, get: function () { return state_model_1.StateModel; } });
const city_model_1 = require("@modules/cities/model/city.model");
Object.defineProperty(exports, "CityModel", { enumerable: true, get: function () { return city_model_1.CityModel; } });
const appointment_model_1 = require("@modules/appointments/model/appointment.model");
Object.defineProperty(exports, "AppointmentModel", { enumerable: true, get: function () { return appointment_model_1.AppointmentModel; } });
const log_model_1 = require("@modules/logs/model/log.model");
Object.defineProperty(exports, "LogModel", { enumerable: true, get: function () { return log_model_1.LogModel; } });
const room_model_1 = require("@modules/rooms/model/room.model");
Object.defineProperty(exports, "RoomModel", { enumerable: true, get: function () { return room_model_1.RoomModel; } });
user_model_1.UserModel.belongsTo(roles_1.RoleModel, {
    foreignKey: 'role_id',
    as: 'role',
});
roles_1.RoleModel.hasMany(user_model_1.UserModel, {
    foreignKey: 'role_id',
    as: 'users',
});
city_model_1.CityModel.belongsTo(state_model_1.StateModel, {
    foreignKey: 'state_id',
    as: 'state',
});
state_model_1.StateModel.hasMany(city_model_1.CityModel, {
    foreignKey: 'state_id',
    as: 'cities',
});
user_model_1.UserModel.belongsTo(city_model_1.CityModel, {
    foreignKey: 'city_id',
    as: 'city',
});
city_model_1.CityModel.hasMany(user_model_1.UserModel, {
    foreignKey: 'city_id',
    as: 'users',
});
user_model_1.UserModel.hasMany(appointment_model_1.AppointmentModel, {
    foreignKey: 'user_id',
    as: 'appointments',
});
appointment_model_1.AppointmentModel.belongsTo(user_model_1.UserModel, {
    foreignKey: 'user_id',
    as: 'user',
});
user_model_1.UserModel.hasMany(log_model_1.LogModel, {
    foreignKey: 'user_id',
    as: 'logs',
});
log_model_1.LogModel.belongsTo(user_model_1.UserModel, {
    foreignKey: 'user_id',
    as: 'user',
});
user_model_1.UserModel.belongsToMany(permissions_1.PermissionModel, {
    through: user_permissions_1.UserPermissionModel,
    foreignKey: 'user_id',
    otherKey: 'permission_id',
    as: 'permissions',
});
permissions_1.PermissionModel.belongsToMany(user_model_1.UserModel, {
    through: user_permissions_1.UserPermissionModel,
    foreignKey: 'permission_id',
    otherKey: 'user_id',
    as: 'users',
});
user_permissions_1.UserPermissionModel.belongsTo(user_model_1.UserModel, {
    foreignKey: 'user_id',
    as: 'user',
});
user_permissions_1.UserPermissionModel.belongsTo(permissions_1.PermissionModel, {
    foreignKey: 'permission_id',
    as: 'permission',
});
//# sourceMappingURL=models.js.map