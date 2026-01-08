import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@shared/config';
import { ROLES } from '@shared/constants';

export class UserModel extends Model {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public roleId!: number;
  public zipCode?: string | null;
  public street?: string | null;
  public number?: string | null;
  public complement?: string | null;
  public neighborhood?: string | null;
  public cityId?: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'last_name',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'email',
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password',
    },
    zipCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'zip_code',
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'street',
    },
    number: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'number',
    },
    complement: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'complement',
    },
    neighborhood: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'neighborhood',
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'city_id',
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: ROLES.USER,
      field: 'role_id',
    },
  },
  {
    sequelize,
    tableName: 'users',
    underscored: true,
    timestamps: true,
  }
);
