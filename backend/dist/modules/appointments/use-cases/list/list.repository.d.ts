import { IAppointment } from '@modules/appointments/model/appointment.interface';
import { IListAppointmentsRequest } from './list.interface';
export declare class ListAppointmentsRepository {
    list(filters: IListAppointmentsRequest): Promise<{
        rows: IAppointment[];
        count: number;
    }>;
}
//# sourceMappingURL=list.repository.d.ts.map