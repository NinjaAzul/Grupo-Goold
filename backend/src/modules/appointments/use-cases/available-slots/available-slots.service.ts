import { AppointmentRepository } from '../../repositories/appointment.repository';
import {
  IAvailableSlotsRequest,
  IAvailableSlotsResponse,
} from './available-slots.interface';
import { AppointmentModel } from '@modules/appointments/model/appointment.model';
import { RoomModel } from '@modules/rooms/model/room.model';
import { Op } from 'sequelize';
import { DateHelper } from '@shared/utils/date.helper';

export class AvailableSlotsService {
  private appointmentRepository: AppointmentRepository;

  constructor() {
    this.appointmentRepository = new AppointmentRepository();
  }

  private async calculateSlotsForRoom(
    room: RoomModel,
    date: string
  ): Promise<string[]> {
    const timeBlock = room.timeBlock;
    const MINIMUM_APPOINTMENT_DURATION = 60;

    const [startHour, startMinute] = room.startTime.split(':');
    const [endHour, endMinute] = room.endTime.split(':');
    const [year, month, day] = date.split('-');

    const startDate = new Date(
      Date.UTC(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(startHour),
        parseInt(startMinute),
        0,
        0
      )
    );
    const endDate = new Date(
      Date.UTC(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(endHour),
        parseInt(endMinute),
        0,
        0
      )
    );

    const dayStartUTC = DateHelper.getStartOfDayUTC(date);
    const dayEndUTC = DateHelper.getEndOfDayUTC(date);

    const existingAppointments = await AppointmentModel.findAll({
      where: {
        room: room.name,
        appointmentDate: {
          [Op.between]: [dayStartUTC, dayEndUTC],
        },
        status: {
          [Op.in]: ['pending', 'scheduled'],
        },
      },
      order: [['appointmentDate', 'ASC']],
    });

    const occupiedIntervals = existingAppointments.map((apt) => {
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

      return {
        start: aptStart,
        end: aptEnd,
      };
    });

    const allSlots: string[] = [];
    let currentTime = new Date(startDate);

    while (currentTime < endDate) {
      const slotStart = new Date(currentTime);
      slotStart.setUTCSeconds(0, 0);
      slotStart.setUTCMilliseconds(0);

      const slotEnd = DateHelper.addMinutesUTC(
        slotStart,
        MINIMUM_APPOINTMENT_DURATION
      );

      if (slotEnd > endDate) {
        break;
      }

      const slotTime = DateHelper.extractTimeOnly(slotStart);

      const hasConflict = occupiedIntervals.some((interval) => {
        const slotStartTime = slotStart.getTime();
        const slotEndTime = slotEnd.getTime();
        const intervalStartTime = interval.start.getTime();
        const intervalEndTime = interval.end.getTime();

        const overlaps =
          (slotStartTime >= intervalStartTime &&
            slotStartTime < intervalEndTime) ||
          (slotEndTime > intervalStartTime && slotEndTime <= intervalEndTime) ||
          (slotStartTime <= intervalStartTime &&
            slotEndTime >= intervalEndTime) ||
          (slotStartTime > intervalStartTime && slotEndTime < intervalEndTime);

        return overlaps;
      });

      if (!hasConflict) {
        allSlots.push(slotTime);
      }

      currentTime = DateHelper.addMinutesUTC(currentTime, timeBlock);
    }

    return allSlots;
  }

  async execute(
    request: IAvailableSlotsRequest
  ): Promise<IAvailableSlotsResponse> {
    const requestDate = new Date(request.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (requestDate < today) {
      return { slots: [] };
    }

    const rooms = await this.appointmentRepository.getRooms(request.roomId);

    if (rooms.length === 0) {
      return { slots: [] };
    }

    const availableSlots: string[] = [];

    for (const room of rooms) {
      const slots = await this.calculateSlotsForRoom(room, request.date);
      availableSlots.push(...slots);
    }

    return { slots: [...new Set(availableSlots)].sort() };
  }
}
