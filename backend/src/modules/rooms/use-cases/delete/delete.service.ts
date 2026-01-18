import { RoomRepository } from '../../repositories/room.repository';
import { NotFoundError, BadRequestError } from '@shared/errors';

export class DeleteRoomService {
  private roomRepository: RoomRepository;

  constructor() {
    this.roomRepository = new RoomRepository();
  }

  async execute(roomId: number): Promise<void> {
    const room = await this.roomRepository.findById(roomId);

    if (!room) {
      throw new NotFoundError('Sala não encontrada');
    }

    const appointmentsCount =
      await this.roomRepository.countAppointmentsByRoomName(room.name);

    if (appointmentsCount > 0) {
      throw new BadRequestError(
        `Não é possível excluir a sala. Existem ${appointmentsCount} agendamento(s) associados a esta sala.`
      );
    }

    await this.roomRepository.delete(roomId);
  }
}
