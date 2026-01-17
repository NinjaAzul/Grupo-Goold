import { IRoom } from '@modules/rooms/model/room.interface';
import { UpdateRoomDto } from './update.dto';
export declare class UpdateRoomRepository {
    update(roomId: number, data: UpdateRoomDto): Promise<IRoom>;
}
//# sourceMappingURL=update.repository.d.ts.map