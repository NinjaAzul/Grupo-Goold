import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@shared/config';
import { IUserPermission } from './user-permission.interface';

export class UserPermissionModel
  extends Model<IUserPermission>
  implements IUserPermission
{
  public id!: number;
  public userId!: number;
  public permissionId!: number;
  public granted!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserPermissionModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'permission_id',
    },
    granted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'granted',
    },
  },
  {
    sequelize,
    tableName: 'user_permissions',
    underscored: true,
    timestamps: true,
  }
);
