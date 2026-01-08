import { RoomModel } from '@modules/rooms/model/room.model';
import { IRoom } from '@modules/rooms/model/room.interface';

export class ListRoomsRepository {
  async findAll(): Promise<IRoom[]> {
    const rooms = await RoomModel.findAll({
      order: [['name', 'ASC']],
    });

    return rooms.map((room) => room.toJSON() as IRoom);
  }
}
