import { RoomModel } from '@modules/rooms/model/room.model';
import { NotFoundError, BadRequestError } from '@shared/errors';
import { AppointmentModel } from '@modules/appointments/model/appointment.model';

export class DeleteRoomRepository {
  async delete(roomId: number): Promise<void> {
    const room = await RoomModel.findByPk(roomId);

    if (!room) {
      throw new NotFoundError('Room not found');
    }

    // Verificar se há agendamentos associados a esta sala
    const appointmentsCount = await AppointmentModel.count({
      where: { room: room.name },
    });

    if (appointmentsCount > 0) {
      throw new BadRequestError(
        `Cannot delete room. There are ${appointmentsCount} appointment(s) associated with this room.`
      );
    }

    await room.destroy();
  }
}
