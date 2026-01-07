import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../@shared';

// Example model structure
// This would be used if health had database persistence
export class HealthModel extends Model {
  public id!: number;
  public status!: string;
  public message!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

HealthModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'health_checks',
    underscored: true,
  }
);
