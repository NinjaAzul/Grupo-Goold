// Centralized model exports and associations
import { UserModel } from '@modules/users/model/user.model';
import { RoleModel } from '@modules/roles';
import { StateModel } from '@modules/states/model/state.model';
import { CityModel } from '@modules/cities/model/city.model';
import { AppointmentModel } from '@modules/appointments/model/appointment.model';
import { LogModel } from '@modules/logs/model/log.model';

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

export {
  UserModel,
  RoleModel,
  StateModel,
  CityModel,
  AppointmentModel,
  LogModel,
};
