import { IAppointment } from '@modules/appointments/model/appointment.interface';

export interface ICreateAppointmentRequest {
  userId: number;
  appointmentDate: Date;
  room: string;
}

export interface ICreateAppointmentResponse {
  appointment: IAppointment;
}
