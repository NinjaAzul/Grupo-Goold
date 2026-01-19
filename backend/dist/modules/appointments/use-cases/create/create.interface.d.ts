import { IAppointment } from '@modules/appointments/model/appointment.interface';
export interface ICreateAppointmentRequest {
    userId: number;
    appointmentDate: Date;
    roomId: number;
}
export interface ICreateAppointmentResponse {
    appointment: IAppointment;
}
//# sourceMappingURL=create.interface.d.ts.map