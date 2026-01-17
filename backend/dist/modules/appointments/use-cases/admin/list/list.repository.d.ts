import { IAppointment } from '@modules/appointments/model/appointment.interface';
import { IListAppointmentsRequest } from './list.interface';
export declare class ListAppointmentsRepository {
    findAll(filters: IListAppointmentsRequest): Promise<{
        appointments: IAppointment[];
        total: number;
    }>;
}
//# sourceMappingURL=list.repository.d.ts.map