import { RoomModel } from '../model/room.model';
import { IRoom } from '../model/room.interface';
import { CreateRoomDto } from '../use-cases/create/create.dto';
import { UpdateRoomDto } from '../use-cases/update/update.dto';
import { AppointmentModel } from '@modules/appointments/model/appointment.model';

export class RoomRepository {
  async create(data: CreateRoomDto): Promise<IRoom | null> {
    const room = await RoomModel.create({
      name: data.name,
      startTime: data.startTime,
      endTime: data.endTime,
      timeBlock: data.timeBlock,
    } as IRoom);

    return room ? (room.toJSON() as IRoom) : null;
  }

  async findAll(): Promise<IRoom[]> {
    const rooms = await RoomModel.findAll({
      order: [['name', 'ASC']],
    });

    return rooms.map((room) => room.toJSON() as IRoom);
  }

  async findById(roomId: number): Promise<IRoom | null> {
    const room = await RoomModel.findByPk(roomId);

    return room ? (room.toJSON() as IRoom) : null;
  }

  async update(roomId: number, data: UpdateRoomDto): Promise<IRoom | null> {
    const room = await RoomModel.findByPk(roomId);

    if (!room) {
      return null;
    }

    await room.update({
      name: data.name ?? room.name,
      startTime: data.startTime ?? room.startTime,
      endTime: data.endTime ?? room.endTime,
      timeBlock: data.timeBlock ?? room.timeBlock,
    });

    return room.toJSON() as IRoom;
  }

  async delete(roomId: number): Promise<boolean> {
    const room = await RoomModel.findByPk(roomId);

    if (!room) {
      return false;
    }

    await room.destroy();
    return true;
  }

  async countAppointmentsByRoomName(roomName: string): Promise<number> {
    return await AppointmentModel.count({
      where: { room: roomName },
    });
  }
}
