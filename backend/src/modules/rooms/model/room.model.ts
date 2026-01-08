import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@shared/config';
import { IRoom } from './room.interface';

export class RoomModel extends Model<IRoom> implements IRoom {
  public id!: number;
  public name!: string;
  public startTime!: string;
  public endTime!: string;
  public timeBlock!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RoomModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'name',
    },
    startTime: {
      type: DataTypes.STRING(5),
      allowNull: false,
      field: 'start_time',
      validate: {
        is: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, // Valida formato HH:mm
      },
    },
    endTime: {
      type: DataTypes.STRING(5),
      allowNull: false,
      field: 'end_time',
      validate: {
        is: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, // Valida formato HH:mm
      },
    },
    timeBlock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'time_block',
      comment: 'Bloco de horários em minutos (ex: 30, 60)',
    },
  },
  {
    sequelize,
    tableName: 'rooms',
    underscored: true,
    timestamps: true,
  }
);
