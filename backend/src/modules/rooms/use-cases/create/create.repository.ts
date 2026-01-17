import { RoomModel } from '@modules/rooms/model/room.model';
import { IRoom } from '@modules/rooms/model/room.interface';
import { CreateRoomDto } from './create.dto';

export class CreateRoomRepository {
  async create(data: CreateRoomDto): Promise<IRoom | null> {
    const room = await RoomModel.create({
      name: data.name,
      startTime: data.startTime,
      endTime: data.endTime,
      timeBlock: data.timeBlock,
    } as IRoom);

    return room ? (room.toJSON() as IRoom) : null;
  }
}
