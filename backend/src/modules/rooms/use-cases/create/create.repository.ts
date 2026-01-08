import { RoomModel } from '@modules/rooms/model/room.model';
import { IRoom } from '@modules/rooms/model/room.interface';
import { CreateRoomDto } from './create.dto';
import { BadRequestError } from '@shared/errors';

export class CreateRoomRepository {
  async create(data: CreateRoomDto): Promise<IRoom> {
    // Verificar se já existe uma sala com o mesmo nome
    const existingRoom = await RoomModel.findOne({
      where: { name: data.name },
    });

    if (existingRoom) {
      throw new BadRequestError('Room with this name already exists');
    }

    const room = await RoomModel.create({
      name: data.name,
      startTime: data.startTime,
      endTime: data.endTime,
      timeBlock: data.timeBlock,
    });

    return room.toJSON() as IRoom;
  }
}
