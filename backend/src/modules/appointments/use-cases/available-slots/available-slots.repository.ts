import { RoomModel } from '@modules/rooms/model/room.model';

export class AvailableSlotsRepository {
  async getRooms(roomId?: number): Promise<RoomModel[]> {
    const roomsWhere: { id?: number } = {};
    if (roomId) {
      roomsWhere.id = roomId;
    }

    return await RoomModel.findAll({
      where: roomsWhere,
    });
  }
}
