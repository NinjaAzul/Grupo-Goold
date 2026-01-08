import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@shared/config';
import { IAppointment, AppointmentStatus } from './appointment.interface';

export class AppointmentModel
  extends Model<IAppointment>
  implements IAppointment
{
  public id!: number;
  public userId!: number;
  public appointmentDate!: Date;
  public room!: string;
  public status!: AppointmentStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AppointmentModel.init(
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
    appointmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'appointment_date',
    },
    room: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'room',
    },
    status: {
      type: DataTypes.ENUM('pending', 'scheduled', 'cancelled'),
      allowNull: false,
      defaultValue: AppointmentStatus.PENDING,
      field: 'status',
    },
  },
  {
    sequelize,
    tableName: 'appointments',
    underscored: true,
    timestamps: true,
  }
);
