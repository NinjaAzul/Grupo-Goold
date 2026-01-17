import { UpdateRoomDto } from './update.dto';
import { IRoom } from '@modules/rooms/model/room.interface';
export declare class UpdateRoomService {
    private repository;
    constructor();
    execute(roomId: number, data: UpdateRoomDto): Promise<IRoom>;
}
//# sourceMappingURL=update.service.d.ts.map