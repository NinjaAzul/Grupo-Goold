// Centralized model exports and associations
import { UserModel } from '@modules/users/model/user.model';
import { RoleModel } from '@modules/roles';
import { StateModel } from '@modules/states/model/state.model';
import { CityModel } from '@modules/cities/model/city.model';
import { AppointmentModel } from '@modules/appointments/model/appointment.model';
import { LogModel } from '@modules/logs/model/log.model';

// Definir relacionamentos User-Role
UserModel.belongsTo(RoleModel, {
  foreignKey: 'role_id',
  as: 'role',
});

RoleModel.hasMany(UserModel, {
  foreignKey: 'role_id',
  as: 'users',
});

// Definir relacionamentos State-City
CityModel.belongsTo(StateModel, {
  foreignKey: 'state_id',
  as: 'state',
});

StateModel.hasMany(CityModel, {
  foreignKey: 'state_id',
  as: 'cities',
});

// Definir relacionamentos User-City
UserModel.belongsTo(CityModel, {
  foreignKey: 'city_id',
  as: 'city',
});

CityModel.hasMany(UserModel, {
  foreignKey: 'city_id',
  as: 'users',
});

// Definir relacionamentos User-Appointment
UserModel.hasMany(AppointmentModel, {
  foreignKey: 'user_id',
  as: 'appointments',
});

AppointmentModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  as: 'user',
});

// Definir relacionamentos User-Log
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
