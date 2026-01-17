import { UpdateRoomRepository } from './update.repository';
import { UpdateRoomDto } from './update.dto';
import { IRoom } from '@modules/rooms/model/room.interface';
import { NotFoundError, BadRequestError } from '@shared/errors';
import { RoomModel } from '@modules/rooms/model/room.model';

export class UpdateRoomService {
  private repository: UpdateRoomRepository;

  constructor() {
    this.repository = new UpdateRoomRepository();
  }

  async execute(roomId: number, data: UpdateRoomDto): Promise<IRoom> {
    const room = await RoomModel.findByPk(roomId);

    if (!room) {
      throw new NotFoundError('Room not found');
    }

    if (data.name && data.name !== room.name) {
      const existingRoom = await RoomModel.findOne({
        where: { name: data.name },
      });

      if (existingRoom) {
        throw new BadRequestError('Room with this name already exists');
      }
    }

    const updatedRoom = await this.repository.update(roomId, data);

    if (!updatedRoom) {
      throw new NotFoundError('Room not found');
    }

    return updatedRoom;
  }
}
