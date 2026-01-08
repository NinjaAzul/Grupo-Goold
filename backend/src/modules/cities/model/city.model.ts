import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@shared/config';
import { ICity } from './city.interface';

type CityCreationAttributes = Omit<ICity, 'createdAt' | 'updatedAt'>;

export class CityModel
  extends Model<ICity, CityCreationAttributes>
  implements ICity
{
  public id!: number;
  public name!: string;
  public stateId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CityModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: 'id',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'name',
    },
    stateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'state_id',
    },
  },
  {
    sequelize,
    tableName: 'cities',
    underscored: true,
    timestamps: true,
  }
);
