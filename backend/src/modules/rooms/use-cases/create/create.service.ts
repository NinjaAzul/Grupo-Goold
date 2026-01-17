import { CreateRoomRepository } from './create.repository';
import { ICreateRoomRequest, ICreateRoomResponse } from './create.interface';
import { BadRequestError } from '@shared/errors';
import { RoomModel } from '@modules/rooms/model/room.model';

export class CreateRoomService {
  private repository: CreateRoomRepository;

  constructor() {
    this.repository = new CreateRoomRepository();
  }

  async execute(request: ICreateRoomRequest): Promise<ICreateRoomResponse> {
    const existingRoom = await RoomModel.findOne({
      where: { name: request.name },
    });

    if (existingRoom) {
      throw new BadRequestError('Room with this name already exists');
    }

    const room = await this.repository.create(request);

    if (!room) {
      throw new Error('Failed to create room');
    }

    return { room };
  }
}
