// Centralized model exports and associations
import { UserModel } from '@modules/users/model/user.model';
import { RoleModel } from '@modules/roles/role.model';

// Definir relacionamentos
UserModel.belongsTo(RoleModel, {
  foreignKey: 'role_id',
  as: 'role',
});

RoleModel.hasMany(UserModel, {
  foreignKey: 'role_id',
  as: 'users',
});

export { UserModel, RoleModel };
