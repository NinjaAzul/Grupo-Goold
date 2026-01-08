// Centralized model exports and associations
import { UserModel } from '@modules/users/model/user.model';
import { RoleModel } from '@modules/roles';
import { PermissionModel } from '@modules/permissions';
import { UserPermissionModel } from '@modules/user-permissions';
import { StateModel } from '@modules/states/model/state.model';
import { CityModel } from '@modules/cities/model/city.model';
import { AppointmentModel } from '@modules/appointments/model/appointment.model';
import { LogModel } from '@modules/logs/model/log.model';
import { RoomModel } from '@modules/rooms/model/room.model';

UserModel.belongsTo(RoleModel, {
  foreignKey: 'role_id',
  as: 'role',
});

RoleModel.hasMany(UserModel, {
  foreignKey: 'role_id',
  as: 'users',
});

CityModel.belongsTo(StateModel, {
  foreignKey: 'state_id',
  as: 'state',
});

StateModel.hasMany(CityModel, {
  foreignKey: 'state_id',
  as: 'cities',
});

UserModel.belongsTo(CityModel, {
  foreignKey: 'city_id',
  as: 'city',
});

CityModel.hasMany(UserModel, {
  foreignKey: 'city_id',
  as: 'users',
});

UserModel.hasMany(AppointmentModel, {
  foreignKey: 'user_id',
  as: 'appointments',
});

AppointmentModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  as: 'user',
});

UserModel.hasMany(LogModel, {
  foreignKey: 'user_id',
  as: 'logs',
});

LogModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  as: 'user',
});

UserModel.belongsToMany(PermissionModel, {
  through: UserPermissionModel,
  foreignKey: 'user_id',
  otherKey: 'permission_id',
  as: 'permissions',
});

PermissionModel.belongsToMany(UserModel, {
  through: UserPermissionModel,
  foreignKey: 'permission_id',
  otherKey: 'user_id',
  as: 'users',
});

UserPermissionModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  as: 'user',
});

UserPermissionModel.belongsTo(PermissionModel, {
  foreignKey: 'permission_id',
  as: 'permission',
});

export {
  UserModel,
  RoleModel,
  PermissionModel,
  UserPermissionModel,
  StateModel,
  CityModel,
  AppointmentModel,
  LogModel,
  RoomModel,
};
