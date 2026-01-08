import { IUser } from '@modules/users/model/user.interface';

export enum AppointmentStatus {
  PENDING = 'pending',
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled',
}

export interface IAppointment {
  id: number;
  userId: number;
  appointmentDate: Date;
  room: string;
  status: AppointmentStatus;
  user?: IUser;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
