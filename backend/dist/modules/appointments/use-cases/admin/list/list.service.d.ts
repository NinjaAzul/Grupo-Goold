import { IListAppointmentsRequest, IListAppointmentsResponse } from './list.interface';
export declare class ListAppointmentsService {
    private repository;
    constructor();
    execute(filters: IListAppointmentsRequest): Promise<IListAppointmentsResponse>;
}
//# sourceMappingURL=list.service.d.ts.map