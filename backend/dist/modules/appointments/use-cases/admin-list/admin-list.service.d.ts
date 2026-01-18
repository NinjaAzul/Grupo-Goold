import { IAdminListAppointmentsRequest, IAdminListAppointmentsResponse } from './admin-list.interface';
export declare class AdminListAppointmentsService {
    private appointmentRepository;
    constructor();
    execute(filters: IAdminListAppointmentsRequest): Promise<IAdminListAppointmentsResponse>;
}
//# sourceMappingURL=admin-list.service.d.ts.map