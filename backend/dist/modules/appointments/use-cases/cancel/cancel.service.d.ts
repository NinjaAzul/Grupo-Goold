import { ICancelAppointmentRequest, ICancelAppointmentResponse } from './cancel.interface';
export declare class CancelAppointmentService {
    private appointmentRepository;
    constructor();
    execute(request: ICancelAppointmentRequest): Promise<ICancelAppointmentResponse>;
}
//# sourceMappingURL=cancel.service.d.ts.map