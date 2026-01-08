import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@shared/config';
import { IState } from './state.interface';

type StateCreationAttributes = Omit<IState, 'createdAt' | 'updatedAt'>;

export class StateModel
  extends Model<IState, StateCreationAttributes>
  implements IState
{
  public id!: number;
  public name!: string;
  public uf!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

StateModel.init(
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
    uf: {
      type: DataTypes.STRING(2),
      allowNull: false,
      unique: true,
      field: 'uf',
    },
  },
  {
    sequelize,
    tableName: 'states',
    underscored: true,
    timestamps: true,
  }
);
