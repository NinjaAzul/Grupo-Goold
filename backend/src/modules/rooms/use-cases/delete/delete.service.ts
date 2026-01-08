import { DeleteRoomRepository } from './delete.repository';

export class DeleteRoomService {
  private repository: DeleteRoomRepository;

  constructor() {
    this.repository = new DeleteRoomRepository();
  }

  async execute(roomId: number): Promise<void> {
    await this.repository.delete(roomId);
  }
}
