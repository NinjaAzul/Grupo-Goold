import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@shared/config';
import { ILog } from './log.interface';

export class LogModel extends Model<ILog> implements ILog {
  public id!: number;
  public userId!: number | null;
  public activityType!: string;
  public module!: string;
  public description!: string | null;
  public readonly createdAt!: Date;
}

LogModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'user_id',
    },
    activityType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'activity_type',
    },
    module: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'module',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description',
    },
  },
  {
    sequelize,
    tableName: 'logs',
    underscored: true,
    timestamps: true,
    updatedAt: false, // Logs são imutáveis, apenas created_at
  }
);
