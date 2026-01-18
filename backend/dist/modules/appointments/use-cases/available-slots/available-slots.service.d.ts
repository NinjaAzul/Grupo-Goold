import { IAvailableSlotsRequest, IAvailableSlotsResponse } from './available-slots.interface';
export declare class AvailableSlotsService {
    private appointmentRepository;
    constructor();
    private calculateSlotsForRoom;
    execute(request: IAvailableSlotsRequest): Promise<IAvailableSlotsResponse>;
}
//# sourceMappingURL=available-slots.service.d.ts.map