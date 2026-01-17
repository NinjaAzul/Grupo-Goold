import { AppointmentStatus } from '@modules/appointments/model/appointment.interface';
import { IAppointment } from '@modules/appointments/model/appointment.interface';
export declare class UpdateStatusRepository {
    updateStatus(appointmentId: number, status: AppointmentStatus): Promise<IAppointment>;
}
//# sourceMappingURL=update-status.repository.d.ts.map