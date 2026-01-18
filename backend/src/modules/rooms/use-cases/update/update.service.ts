import { RoomRepository } from '../../repositories/room.repository';
import { UpdateRoomDto } from './update.dto';
import { IRoom } from '@modules/rooms/model/room.interface';
import { NotFoundError, BadRequestError } from '@shared/errors';
import { RoomModel } from '@modules/rooms/model/room.model';

export class UpdateRoomService {
  private roomRepository: RoomRepository;

  constructor() {
    this.roomRepository = new RoomRepository();
  }

  async execute(roomId: number, data: UpdateRoomDto): Promise<IRoom> {
    const room = await RoomModel.findByPk(roomId);

    if (!room) {
      throw new NotFoundError('Sala não encontrada');
    }

    if (data.name && data.name !== room.name) {
      const existingRoom = await RoomModel.findOne({
        where: { name: data.name },
      });

      if (existingRoom) {
        throw new BadRequestError('Já existe uma sala com este nome');
      }
    }

    const updatedRoom = await this.roomRepository.update(roomId, data);

    if (!updatedRoom) {
      throw new NotFoundError('Sala não encontrada');
    }

    return updatedRoom;
  }
}
