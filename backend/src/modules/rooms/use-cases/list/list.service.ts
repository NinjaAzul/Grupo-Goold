import { ListRoomsRepository } from './list.repository';
import { IRoom } from '@modules/rooms/model/room.interface';

export class ListRoomsService {
  private repository: ListRoomsRepository;

  constructor() {
    this.repository = new ListRoomsRepository();
  }

  async execute(): Promise<IRoom[]> {
    return await this.repository.findAll();
  }
}
