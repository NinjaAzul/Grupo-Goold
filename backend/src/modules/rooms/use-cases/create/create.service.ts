import { RoomRepository } from '../../repositories/room.repository';
import { ICreateRoomRequest, ICreateRoomResponse } from './create.interface';
import { BadRequestError } from '@shared/errors';
import { RoomModel } from '@modules/rooms/model/room.model';

export class CreateRoomService {
  private roomRepository: RoomRepository;

  constructor() {
    this.roomRepository = new RoomRepository();
  }

  async execute(request: ICreateRoomRequest): Promise<ICreateRoomResponse> {
    const existingRoom = await RoomModel.findOne({
      where: { name: request.name },
    });

    if (existingRoom) {
      throw new BadRequestError('Já existe uma sala com este nome');
    }

    const room = await this.roomRepository.create(request);

    if (!room) {
      throw new Error('Falha ao criar sala');
    }

    return { room };
  }
}
