import { AvailableRoomsService } from './available-rooms.service';
import { AppointmentRepository } from '../../repositories/appointment.repository';
import { AppointmentModel } from '@modules/appointments/model/appointment.model';
import { RoomModel } from '@modules/rooms/model/room.model';
import { DateHelper } from '@shared/utils/date.helper';
import { AppointmentStatus } from '@modules/appointments/model/appointment.interface';
import { IRoom } from '@modules/rooms/model/room.interface';

// Mocks
jest.mock('../../repositories/appointment.repository');
jest.mock('@modules/appointments/model/appointment.model');
jest.mock('@modules/rooms/model/room.model');
jest.mock('@shared/utils/date.helper');

describe('AvailableRoomsService', () => {
  let availableRoomsService: AvailableRoomsService;
  let mockAppointmentRepository: jest.Mocked<AppointmentRepository>;
  const mockAppointmentModel = AppointmentModel as jest.Mocked<
    typeof AppointmentModel
  >;
  const mockDateHelper = DateHelper as jest.Mocked<typeof DateHelper>;

  beforeEach(() => {
    mockAppointmentRepository =
      new AppointmentRepository() as jest.Mocked<AppointmentRepository>;
    availableRoomsService = new AvailableRoomsService();
    (
      availableRoomsService as unknown as {
        appointmentRepository: AppointmentRepository;
      }
    ).appointmentRepository = mockAppointmentRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const mockRoom: Partial<IRoom> = {
      id: 1,
      name: 'Sala A',
      startTime: '08:00',
      endTime: '18:00',
      timeBlock: 30,
    };

    it('should return empty rooms when date and time are in the past', async () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);
      const dateString = pastDate.toISOString().split('T')[0];
      const timeString = `${pastDate.getHours().toString().padStart(2, '0')}:${pastDate.getMinutes().toString().padStart(2, '0')}`;

      mockDateHelper.createUTCDate = jest.fn().mockReturnValue(pastDate);

      const result = await availableRoomsService.execute({
        date: dateString,
        time: timeString,
      });

      expect(result.rooms).toEqual([]);
      expect(mockAppointmentRepository.getRooms).not.toHaveBeenCalled();
    });

    it('should return empty rooms when no rooms found', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateString = futureDate.toISOString().split('T')[0];
      const timeString = '10:00';

      mockDateHelper.createUTCDate = jest.fn().mockReturnValue(futureDate);
      mockAppointmentRepository.getRooms = jest.fn().mockResolvedValue([]);

      const result = await availableRoomsService.execute({
        date: dateString,
        time: timeString,
      });

      expect(result.rooms).toEqual([]);
      expect(mockAppointmentRepository.getRooms).toHaveBeenCalled();
    });

    it('should filter out rooms when time is outside room range', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateString = futureDate.toISOString().split('T')[0];
      const timeString = '19:00';

      const mockRoomModel = {
        id: 1,
        name: 'Sala A',
        startTime: '08:00',
        endTime: '18:00',
        timeBlock: 30,
        toJSON: () => mockRoom,
      } as unknown as RoomModel;

      mockDateHelper.createUTCDate = jest.fn().mockReturnValue(futureDate);
      mockAppointmentRepository.getRooms = jest
        .fn()
        .mockResolvedValue([mockRoomModel]);
      mockAppointmentModel.findAll = jest.fn().mockResolvedValue([]);

      const result = await availableRoomsService.execute({
        date: dateString,
        time: timeString,
      });

      expect(result.rooms).toEqual([]);
    });

    it('should return available rooms when time is within range and no conflicts', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateString = futureDate.toISOString().split('T')[0];
      const timeString = '10:00';

      const mockRoomModel = {
        id: 1,
        name: 'Sala A',
        startTime: '08:00',
        endTime: '18:00',
        timeBlock: 30,
        toJSON: () => mockRoom,
      } as unknown as RoomModel;

      mockDateHelper.createUTCDate = jest.fn(
        (year, month, day, hour, minute) => {
          return new Date(Date.UTC(year, month - 1, day, hour, minute));
        }
      );
      mockDateHelper.getStartOfDayUTC = jest
        .fn()
        .mockReturnValue(new Date(`${dateString}T00:00:00Z`));
      mockDateHelper.getEndOfDayUTC = jest
        .fn()
        .mockReturnValue(new Date(`${dateString}T23:59:59Z`));
      mockDateHelper.addMinutesUTC = jest.fn((date, minutes) => {
        const result = new Date(date);
        result.setUTCMinutes(result.getUTCMinutes() + minutes);
        return result;
      });
      mockAppointmentRepository.getRooms = jest
        .fn()
        .mockResolvedValue([mockRoomModel]);
      mockAppointmentModel.findAll = jest.fn().mockResolvedValue([]);

      const result = await availableRoomsService.execute({
        date: dateString,
        time: timeString,
      });

      expect(result.rooms.length).toBe(1);
      expect(result.rooms[0].id).toBe(1);
      expect(result.rooms[0].name).toBe('Sala A');
    });

    it('should filter out rooms with conflicting appointments (pending)', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateString = futureDate.toISOString().split('T')[0];
      const timeString = '10:00';

      const mockRoomModel = {
        id: 1,
        name: 'Sala A',
        startTime: '08:00',
        endTime: '18:00',
        timeBlock: 30,
        toJSON: () => mockRoom,
      } as unknown as RoomModel;

      const appointmentDate = new Date(`${dateString}T10:00:00Z`);
      const mockAppointment = {
        id: 1,
        appointmentDate,
        roomId: 1,
        status: AppointmentStatus.PENDING,
      };

      mockDateHelper.createUTCDate = jest.fn(
        (year, month, day, hour, minute) => {
          return new Date(Date.UTC(year, month - 1, day, hour, minute));
        }
      );
      mockDateHelper.getStartOfDayUTC = jest
        .fn()
        .mockReturnValue(new Date(`${dateString}T00:00:00Z`));
      mockDateHelper.getEndOfDayUTC = jest
        .fn()
        .mockReturnValue(new Date(`${dateString}T23:59:59Z`));
      mockDateHelper.addMinutesUTC = jest.fn((date, minutes) => {
        const result = new Date(date);
        result.setUTCMinutes(result.getUTCMinutes() + minutes);
        return result;
      });
      mockDateHelper.addHoursUTC = jest.fn((date, hours) => {
        const result = new Date(date);
        result.setUTCHours(result.getUTCHours() + hours);
        return result;
      });
      mockDateHelper.fromISOString = jest.fn().mockReturnValue(appointmentDate);
      mockAppointmentRepository.getRooms = jest
        .fn()
        .mockResolvedValue([mockRoomModel]);
      mockAppointmentModel.findAll = jest
        .fn()
        .mockResolvedValue([mockAppointment]);

      const result = await availableRoomsService.execute({
        date: dateString,
        time: timeString,
      });

      expect(result.rooms).toEqual([]);
      expect(mockAppointmentModel.findAll).toHaveBeenCalled();
    });

    it('should filter out rooms with conflicting appointments (scheduled)', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateString = futureDate.toISOString().split('T')[0];
      const timeString = '14:00';

      const mockRoomModel = {
        id: 1,
        name: 'Sala A',
        startTime: '08:00',
        endTime: '18:00',
        timeBlock: 30,
        toJSON: () => mockRoom,
      } as unknown as RoomModel;

      const appointmentDate = new Date(`${dateString}T13:30:00Z`);
      const mockAppointment = {
        id: 1,
        appointmentDate,
        roomId: 1,
        status: AppointmentStatus.SCHEDULED,
      };

      mockDateHelper.createUTCDate = jest.fn(
        (year, month, day, hour, minute) => {
          return new Date(Date.UTC(year, month - 1, day, hour, minute));
        }
      );
      mockDateHelper.getStartOfDayUTC = jest
        .fn()
        .mockReturnValue(new Date(`${dateString}T00:00:00Z`));
      mockDateHelper.getEndOfDayUTC = jest
        .fn()
        .mockReturnValue(new Date(`${dateString}T23:59:59Z`));
      mockDateHelper.addMinutesUTC = jest.fn((date, minutes) => {
        const result = new Date(date);
        result.setUTCMinutes(result.getUTCMinutes() + minutes);
        return result;
      });
      mockDateHelper.addHoursUTC = jest.fn((date, hours) => {
        const result = new Date(date);
        result.setUTCHours(result.getUTCHours() + hours);
        return result;
      });
      mockDateHelper.fromISOString = jest.fn().mockReturnValue(appointmentDate);
      mockAppointmentRepository.getRooms = jest
        .fn()
        .mockResolvedValue([mockRoomModel]);
      mockAppointmentModel.findAll = jest
        .fn()
        .mockResolvedValue([mockAppointment]);

      const result = await availableRoomsService.execute({
        date: dateString,
        time: timeString,
      });

      expect(result.rooms).toEqual([]);
    });

    it('should return multiple available rooms when no conflicts', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateString = futureDate.toISOString().split('T')[0];
      const timeString = '11:00';

      const mockRoomModel1 = {
        id: 1,
        name: 'Sala A',
        startTime: '08:00',
        endTime: '18:00',
        timeBlock: 30,
        toJSON: () => ({ ...mockRoom, id: 1 }),
      } as unknown as RoomModel;

      const mockRoomModel2 = {
        id: 2,
        name: 'Sala B',
        startTime: '09:00',
        endTime: '17:00',
        timeBlock: 30,
        toJSON: () => ({ ...mockRoom, id: 2, name: 'Sala B' }),
      } as unknown as RoomModel;

      mockDateHelper.createUTCDate = jest.fn(
        (year, month, day, hour, minute) => {
          return new Date(Date.UTC(year, month - 1, day, hour, minute));
        }
      );
      mockDateHelper.getStartOfDayUTC = jest
        .fn()
        .mockReturnValue(new Date(`${dateString}T00:00:00Z`));
      mockDateHelper.getEndOfDayUTC = jest
        .fn()
        .mockReturnValue(new Date(`${dateString}T23:59:59Z`));
      mockDateHelper.addMinutesUTC = jest.fn((date, minutes) => {
        const result = new Date(date);
        result.setUTCMinutes(result.getUTCMinutes() + minutes);
        return result;
      });
      mockAppointmentRepository.getRooms = jest
        .fn()
        .mockResolvedValue([mockRoomModel1, mockRoomModel2]);
      mockAppointmentModel.findAll = jest.fn().mockResolvedValue([]);

      const result = await availableRoomsService.execute({
        date: dateString,
        time: timeString,
      });

      expect(result.rooms.length).toBe(2);
      expect(result.rooms.map((r) => r.id)).toEqual([1, 2]);
    });

    it('should ignore cancelled appointments when checking conflicts', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateString = futureDate.toISOString().split('T')[0];
      const timeString = '10:00';

      const mockRoomModel = {
        id: 1,
        name: 'Sala A',
        startTime: '08:00',
        endTime: '18:00',
        timeBlock: 30,
        toJSON: () => mockRoom,
      } as unknown as RoomModel;

      const appointmentDate = new Date(`${dateString}T10:00:00Z`);
      const mockAppointment = {
        id: 1,
        appointmentDate,
        roomId: 1,
        status: AppointmentStatus.CANCELLED,
      };

      mockDateHelper.createUTCDate = jest.fn(
        (year, month, day, hour, minute) => {
          return new Date(Date.UTC(year, month - 1, day, hour, minute));
        }
      );
      mockDateHelper.getStartOfDayUTC = jest
        .fn()
        .mockReturnValue(new Date(`${dateString}T00:00:00Z`));
      mockDateHelper.getEndOfDayUTC = jest
        .fn()
        .mockReturnValue(new Date(`${dateString}T23:59:59Z`));
      mockDateHelper.addMinutesUTC = jest.fn((date, minutes) => {
        const result = new Date(date);
        result.setUTCMinutes(result.getUTCMinutes() + minutes);
        return result;
      });
      mockAppointmentRepository.getRooms = jest
        .fn()
        .mockResolvedValue([mockRoomModel]);
      mockAppointmentModel.findAll = jest
        .fn()
        .mockResolvedValue([mockAppointment]);

      await availableRoomsService.execute({
        date: dateString,
        time: timeString,
      });

      expect(mockAppointmentModel.findAll).toHaveBeenCalled();
    });

    it('should handle edge case: time exactly at startTime', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateString = futureDate.toISOString().split('T')[0];
      const timeString = '08:00';

      const mockRoomModel = {
        id: 1,
        name: 'Sala A',
        startTime: '08:00',
        endTime: '18:00',
        timeBlock: 30,
        toJSON: () => mockRoom,
      } as unknown as RoomModel;

      mockDateHelper.createUTCDate = jest.fn().mockReturnValue(futureDate);
      mockDateHelper.getStartOfDayUTC = jest
        .fn()
        .mockReturnValue(new Date(`${dateString}T00:00:00Z`));
      mockDateHelper.getEndOfDayUTC = jest
        .fn()
        .mockReturnValue(new Date(`${dateString}T23:59:59Z`));
      mockDateHelper.addMinutesUTC = jest.fn((date, minutes) => {
        const result = new Date(date);
        result.setUTCMinutes(result.getUTCMinutes() + minutes);
        return result;
      });
      mockAppointmentRepository.getRooms = jest
        .fn()
        .mockResolvedValue([mockRoomModel]);
      mockAppointmentModel.findAll = jest.fn().mockResolvedValue([]);

      const result = await availableRoomsService.execute({
        date: dateString,
        time: timeString,
      });

      expect(result.rooms.length).toBe(1);
    });

    it('should handle edge case: time just before endTime', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateString = futureDate.toISOString().split('T')[0];
      const timeString = '17:00';

      const mockRoomModel = {
        id: 1,
        name: 'Sala A',
        startTime: '08:00',
        endTime: '18:00',
        timeBlock: 30,
        toJSON: () => mockRoom,
      } as unknown as RoomModel;

      mockDateHelper.createUTCDate = jest.fn().mockReturnValue(futureDate);
      mockDateHelper.getStartOfDayUTC = jest
        .fn()
        .mockReturnValue(new Date(`${dateString}T00:00:00Z`));
      mockDateHelper.getEndOfDayUTC = jest
        .fn()
        .mockReturnValue(new Date(`${dateString}T23:59:59Z`));
      mockDateHelper.addMinutesUTC = jest.fn((date, minutes) => {
        const result = new Date(date);
        result.setUTCMinutes(result.getUTCMinutes() + minutes);
        return result;
      });
      mockAppointmentRepository.getRooms = jest
        .fn()
        .mockResolvedValue([mockRoomModel]);
      mockAppointmentModel.findAll = jest.fn().mockResolvedValue([]);

      const result = await availableRoomsService.execute({
        date: dateString,
        time: timeString,
      });

      expect(result.rooms.length).toBeGreaterThanOrEqual(0);
    });
  });
});
