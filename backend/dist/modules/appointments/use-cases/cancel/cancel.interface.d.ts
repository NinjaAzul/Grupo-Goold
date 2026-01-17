import { IAppointment } from '@modules/appointments/model/appointment.interface';
export interface ICancelAppointmentRequest {
    appointmentId: number;
    userId: number;
}
export interface ICancelAppointmentResponse {
    appointment: IAppointment;
}
//# sourceMappingURL=cancel.interface.d.ts.map