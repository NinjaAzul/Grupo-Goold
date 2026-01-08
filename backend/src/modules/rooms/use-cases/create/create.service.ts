import { CreateRoomRepository } from './create.repository';
import { ICreateRoomRequest, ICreateRoomResponse } from './create.interface';

export class CreateRoomService {
  private repository: CreateRoomRepository;

  constructor() {
    this.repository = new CreateRoomRepository();
  }

  async execute(request: ICreateRoomRequest): Promise<ICreateRoomResponse> {
    const room = await this.repository.create(request);

    return { room };
  }
}
