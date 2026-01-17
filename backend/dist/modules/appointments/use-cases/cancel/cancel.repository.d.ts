import { IAppointment } from '@modules/appointments/model/appointment.interface';
import { ICancelAppointmentRequest } from './cancel.interface';
export declare class CancelAppointmentRepository {
    cancel(request: ICancelAppointmentRequest): Promise<IAppointment>;
}
//# sourceMappingURL=cancel.repository.d.ts.map