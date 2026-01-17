import { IAvailableSlotsRequest } from './available-slots.interface';
export declare class AvailableSlotsRepository {
    getAvailableSlots(request: IAvailableSlotsRequest): Promise<string[]>;
    private calculateSlotsForRoom;
}
//# sourceMappingURL=available-slots.repository.d.ts.map