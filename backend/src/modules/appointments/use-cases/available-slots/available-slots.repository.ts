import { AppointmentModel } from '@modules/appointments/model/appointment.model';
import { RoomModel } from '@modules/rooms/model/room.model';
import { IAvailableSlotsRequest } from './available-slots.interface';
import { Op } from 'sequelize';

export class AvailableSlotsRepository {
  async getAvailableSlots(
    request: IAvailableSlotsRequest
  ): Promise<string[]> {
    // Buscar todas as salas ou sala específica
    const roomsWhere: any = {};
    if (request.roomId) {
      roomsWhere.id = request.roomId;
    }

    const rooms = await RoomModel.findAll({
      where: roomsWhere,
    });

    if (rooms.length === 0) {
      return [];
    }

    const availableSlots: string[] = [];

    // Para cada sala, calcular slots disponíveis
    for (const room of rooms) {
      const slots = await this.calculateSlotsForRoom(room, request.date);
      availableSlots.push(...slots);
    }

    // Remover duplicatas e ordenar
    return [...new Set(availableSlots)].sort();
  }

  private async calculateSlotsForRoom(
    room: RoomModel,
    date: string
  ): Promise<string[]> {
    const [startHour, startMin] = room.startTime.split(':').map(Number);
    const [endHour, endMin] = room.endTime.split(':').map(Number);
    const timeBlock = room.timeBlock;

    // Criar data de início e fim do dia
    const startDate = new Date(`${date}T${room.startTime}:00`);
    const endDate = new Date(`${date}T${room.endTime}:00`);

    // Buscar agendamentos já existentes para esta sala e data
    const existingAppointments = await AppointmentModel.findAll({
      where: {
        room: room.name,
        appointmentDate: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
        status: {
          [Op.in]: ['pending', 'scheduled'], // Apenas agendamentos ativos
        },
      },
    });

    // Criar array de horários ocupados
    const occupiedSlots = existingAppointments.map((apt) => {
      const aptDate = new Date(apt.appointmentDate);
      const hours = aptDate.getHours().toString().padStart(2, '0');
      const minutes = aptDate.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    });

    // Gerar todos os slots possíveis
    const allSlots: string[] = [];
    const currentTime = new Date(startDate);

    while (currentTime < endDate) {
      const hours = currentTime.getHours().toString().padStart(2, '0');
      const minutes = currentTime.getMinutes().toString().padStart(2, '0');
      const slot = `${hours}:${minutes}`;

      // Adicionar apenas se não estiver ocupado
      if (!occupiedSlots.includes(slot)) {
        allSlots.push(slot);
      }

      // Avançar pelo timeBlock
      currentTime.setMinutes(currentTime.getMinutes() + timeBlock);
    }

    return allSlots;
  }
}

