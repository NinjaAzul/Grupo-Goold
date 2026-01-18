import { RoomRepository } from '../../repositories/room.repository';
import { IRoom } from '@modules/rooms/model/room.interface';

export class ListRoomsService {
  private roomRepository: RoomRepository;

  constructor() {
    this.roomRepository = new RoomRepository();
  }

  async execute(): Promise<IRoom[]> {
    return await this.roomRepository.findAll();
  }
}
