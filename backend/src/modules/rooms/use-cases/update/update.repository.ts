import { RoomModel } from '@modules/rooms/model/room.model';
import { IRoom } from '@modules/rooms/model/room.interface';
import { UpdateRoomDto } from './update.dto';

export class UpdateRoomRepository {
  async update(roomId: number, data: UpdateRoomDto): Promise<IRoom | null> {
    const room = await RoomModel.findByPk(roomId);

    if (!room) {
      return null;
    }

    await room.update({
      name: data.name ?? room.name,
      startTime: data.startTime ?? room.startTime,
      endTime: data.endTime ?? room.endTime,
      timeBlock: data.timeBlock ?? room.timeBlock,
    });

    return room.toJSON() as IRoom;
  }
}
