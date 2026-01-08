import { UpdateRoomRepository } from './update.repository';
import { UpdateRoomDto } from './update.dto';
import { IRoom } from '@modules/rooms/model/room.interface';

export class UpdateRoomService {
  private repository: UpdateRoomRepository;

  constructor() {
    this.repository = new UpdateRoomRepository();
  }

  async execute(roomId: number, data: UpdateRoomDto): Promise<IRoom> {
    return await this.repository.update(roomId, data);
  }
}
