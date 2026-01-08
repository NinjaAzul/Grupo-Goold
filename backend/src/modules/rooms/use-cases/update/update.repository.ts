import { RoomModel } from '@modules/rooms/model/room.model';
import { IRoom } from '@modules/rooms/model/room.interface';
import { UpdateRoomDto } from './update.dto';
import { NotFoundError, BadRequestError } from '@shared/errors';

export class UpdateRoomRepository {
  async update(roomId: number, data: UpdateRoomDto): Promise<IRoom> {
    const room = await RoomModel.findByPk(roomId);

    if (!room) {
      throw new NotFoundError('Room not found');
    }

    // Se está tentando atualizar o nome, verificar se já existe
    if (data.name && data.name !== room.name) {
      const existingRoom = await RoomModel.findOne({
        where: { name: data.name },
      });

      if (existingRoom) {
        throw new BadRequestError('Room with this name already exists');
      }
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
