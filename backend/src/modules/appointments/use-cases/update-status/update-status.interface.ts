import { AppointmentStatus } from '@modules/appointments/model/appointment.interface';
import { IAppointment } from '@modules/appointments/model/appointment.interface';

export interface IUpdateStatusRequest {
  appointmentId: number;
  status: AppointmentStatus;
  adminUserId?: number;
}

export interface IUpdateStatusResponse {
  appointment: IAppointment;
}
