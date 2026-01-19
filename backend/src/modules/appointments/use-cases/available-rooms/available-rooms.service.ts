import { AppointmentRepository } from '../../repositories/appointment.repository';
import {
  IAvailableRoomsRequest,
  IAvailableRoomsResponse,
} from './available-rooms.interface';
import { AppointmentModel } from '@modules/appointments/model/appointment.model';
import { RoomModel } from '@modules/rooms/model/room.model';
import { Op } from 'sequelize';
import { DateHelper } from '@shared/utils/date.helper';
import { IRoom } from '@modules/rooms/model/room.interface';

export class AvailableRoomsService {
  private appointmentRepository: AppointmentRepository;
  private readonly MINIMUM_APPOINTMENT_DURATION = 60;

  constructor() {
    this.appointmentRepository = new AppointmentRepository();
  }

  private isTimeInRange(
    time: string,
    startTime: string,
    endTime: string
  ): boolean {
    const [timeHour, timeMinute] = time.split(':').map(Number);
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const timeMinutes = timeHour * 60 + timeMinute;
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    if (timeMinutes < startMinutes || timeMinutes >= endMinutes) {
      return false;
    }

    const timeEndMinutes = timeMinutes + this.MINIMUM_APPOINTMENT_DURATION;
    return timeEndMinutes <= endMinutes;
  }

  private async hasConflict(
    room: RoomModel,
    date: string,
    time: string
  ): Promise<boolean> {
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    const requestedStart = DateHelper.createUTCDate(
      year,
      month,
      day,
      hour,
      minute
    );
    const requestedEnd = DateHelper.addMinutesUTC(
      requestedStart,
      this.MINIMUM_APPOINTMENT_DURATION
    );

    const dayStartUTC = DateHelper.getStartOfDayUTC(date);
    const dayEndUTC = DateHelper.getEndOfDayUTC(date);

    const existingAppointments = await AppointmentModel.findAll({
      where: {
        roomId: room.id,
        appointmentDate: {
          [Op.between]: [dayStartUTC, dayEndUTC],
        },
        status: {
          [Op.in]: ['pending', 'scheduled'],
        },
      },
    });

    for (const apt of existingAppointments) {
      let aptDate: Date;
      if (apt.appointmentDate instanceof Date) {
        aptDate = apt.appointmentDate;
      } else {
        aptDate = DateHelper.fromISOString(String(apt.appointmentDate));
      }

      const aptStart = DateHelper.createUTCDate(
        aptDate.getUTCFullYear(),
        aptDate.getUTCMonth() + 1,
        aptDate.getUTCDate(),
        aptDate.getUTCHours(),
        aptDate.getUTCMinutes()
      );

      const aptEnd = DateHelper.addHoursUTC(aptStart, 1);

      const requestedStartTime = requestedStart.getTime();
      const requestedEndTime = requestedEnd.getTime();
      const aptStartTime = aptStart.getTime();
      const aptEndTime = aptEnd.getTime();

      const overlaps =
        (requestedStartTime >= aptStartTime &&
          requestedStartTime < aptEndTime) ||
        (requestedEndTime > aptStartTime && requestedEndTime <= aptEndTime) ||
        (requestedStartTime <= aptStartTime &&
          requestedEndTime >= aptEndTime) ||
        (requestedStartTime > aptStartTime && requestedEndTime < aptEndTime);

      if (overlaps) {
        return true;
      }
    }

    return false;
  }

  async execute(
    request: IAvailableRoomsRequest
  ): Promise<IAvailableRoomsResponse> {
    const [year, month, day] = request.date.split('-').map(Number);
    const [hour, minute] = request.time.split(':').map(Number);

    const requestedDateTime = DateHelper.createUTCDate(
      year,
      month,
      day,
      hour,
      minute
    );
    const now = new Date();

    if (requestedDateTime < now) {
      return { rooms: [] };
    }

    const allRooms = await this.appointmentRepository.getRooms();

    const availableRooms: IRoom[] = [];

    for (const room of allRooms) {
      if (!this.isTimeInRange(request.time, room.startTime, room.endTime)) {
        continue;
      }

      const conflict = await this.hasConflict(room, request.date, request.time);
      if (!conflict) {
        availableRooms.push(room.toJSON() as IRoom);
      }
    }

    return { rooms: availableRooms };
  }
}
