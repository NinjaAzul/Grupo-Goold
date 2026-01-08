import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@shared/config';
import { IPermission } from './permission.interface';

export class PermissionModel extends Model<IPermission> implements IPermission {
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PermissionModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'name',
    },
  },
  {
    sequelize,
    tableName: 'permissions',
    underscored: true,
    timestamps: true,
  }
);
