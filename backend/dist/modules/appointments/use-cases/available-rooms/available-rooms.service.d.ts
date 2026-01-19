import { IAvailableRoomsRequest, IAvailableRoomsResponse } from './available-rooms.interface';
export declare class AvailableRoomsService {
    private appointmentRepository;
    private readonly MINIMUM_APPOINTMENT_DURATION;
    constructor();
    private isTimeInRange;
    private hasConflict;
    execute(request: IAvailableRoomsRequest): Promise<IAvailableRoomsResponse>;
}
//# sourceMappingURL=available-rooms.service.d.ts.map