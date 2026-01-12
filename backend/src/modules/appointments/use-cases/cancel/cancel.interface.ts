import { IAppointment } from '@modules/appointments/model/appointment.interface';

export interface ICancelAppointmentRequest {
  appointmentId: number;
  userId: number; // ID do usuário que está cancelando
}

export interface ICancelAppointmentResponse {
  appointment: IAppointment;
}

