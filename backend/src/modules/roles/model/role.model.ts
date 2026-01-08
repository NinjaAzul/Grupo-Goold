import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@shared/config';

export class RoleModel extends Model {
  public id!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RoleModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      // Sem autoIncrement - IDs serão definidos via seed
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'name',
    },
  },
  {
    sequelize,
    tableName: 'roles',
    underscored: true,
    timestamps: true,
  }
);
