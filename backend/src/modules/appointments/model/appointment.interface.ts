import { IUser } from '@modules/users/model/user.interface';
import { IRoom } from '@modules/rooms/model/room.interface';

export enum AppointmentStatus {
  PENDING = 'pending',
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled',
}

export interface IAppointment {
  id: number;
  userId: number;
  appointmentDate: Date;
  roomId: number;
  status: AppointmentStatus;
  user?: IUser;
  room?: IRoom;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
