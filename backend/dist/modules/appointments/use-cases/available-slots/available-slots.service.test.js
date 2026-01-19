"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const available_slots_service_1 = require("./available-slots.service");
const appointment_repository_1 = require("../../repositories/appointment.repository");
const appointment_model_1 = require("@modules/appointments/model/appointment.model");
const date_helper_1 = require("@shared/utils/date.helper");
const appointment_interface_1 = require("@modules/appointments/model/appointment.interface");
// Mocks
jest.mock('../../repositories/appointment.repository');
jest.mock('@modules/appointments/model/appointment.model');
jest.mock('@modules/rooms/model/room.model');
jest.mock('@shared/utils/date.helper');
describe('AvailableSlotsService', () => {
    let availableSlotsService;
    let mockAppointmentRepository;
    const mockAppointmentModel = appointment_model_1.AppointmentModel;
    const mockDateHelper = date_helper_1.DateHelper;
    beforeEach(() => {
        mockAppointmentRepository =
            new appointment_repository_1.AppointmentRepository();
        availableSlotsService = new available_slots_service_1.AvailableSlotsService();
        availableSlotsService.appointmentRepository = mockAppointmentRepository;
        jest.clearAllMocks();
    });
    describe('execute', () => {
        const mockRoom = {
            id: 1,
            name: 'Sala A',
            startTime: '08:00',
            endTime: '18:00',
            timeBlock: 30,
        };
        it('should return empty slots when date is in the past', async () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 1);
            const dateString = pastDate.toISOString().split('T')[0];
            const result = await availableSlotsService.execute({ date: dateString });
            expect(result.slots).toEqual([]);
            expect(mockAppointmentRepository.getRooms).not.toHaveBeenCalled();
        });
        it('should return empty slots when no rooms found', async () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 1);
            const dateString = futureDate.toISOString().split('T')[0];
            mockAppointmentRepository.getRooms = jest.fn().mockResolvedValue([]);
            const result = await availableSlotsService.execute({ date: dateString });
            expect(result.slots).toEqual([]);
            expect(mockAppointmentRepository.getRooms).toHaveBeenCalledWith(undefined);
        });
        it('should return available slots for a room without appointments', async () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 1);
            const dateString = futureDate.toISOString().split('T')[0];
            const mockRoomModel = {
                id: 1,
                name: 'Sala A',
                startTime: '08:00',
                endTime: '18:00',
                timeBlock: 30,
                toJSON: () => mockRoom,
            };
            mockAppointmentRepository.getRooms = jest
                .fn()
                .mockResolvedValue([mockRoomModel]);
            mockAppointmentModel.findAll = jest.fn().mockResolvedValue([]);
            mockDateHelper.getStartOfDayUTC = jest
                .fn()
                .mockReturnValue(new Date('2024-01-20T00:00:00Z'));
            mockDateHelper.getEndOfDayUTC = jest
                .fn()
                .mockReturnValue(new Date('2024-01-20T23:59:59Z'));
            mockDateHelper.createUTCDate = jest.fn((year, month, day, hour, minute) => {
                return new Date(Date.UTC(year, month - 1, day, hour, minute));
            });
            mockDateHelper.addMinutesUTC = jest.fn((date, minutes) => {
                const result = new Date(date);
                result.setUTCMinutes(result.getUTCMinutes() + minutes);
                return result;
            });
            mockDateHelper.extractTimeOnly = jest.fn((date) => {
                const dateObj = typeof date === 'string' ? new Date(date) : date;
                const hours = dateObj.getUTCHours().toString().padStart(2, '0');
                const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');
                return `${hours}:${minutes}`;
            });
            const result = await availableSlotsService.execute({ date: dateString });
            expect(mockAppointmentRepository.getRooms).toHaveBeenCalledWith(undefined);
            expect(mockAppointmentModel.findAll).toHaveBeenCalled();
            expect(result.slots.length).toBeGreaterThan(0);
        });
        it('should filter out slots that conflict with existing appointments', async () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 1);
            const dateString = futureDate.toISOString().split('T')[0];
            const mockRoomModel = {
                id: 1,
                name: 'Sala A',
                startTime: '08:00',
                endTime: '18:00',
                timeBlock: 30,
                toJSON: () => mockRoom,
            };
            const appointmentDate = new Date('2024-01-20T10:00:00Z');
            const mockAppointment = {
                id: 1,
                appointmentDate,
                room: 'Sala A',
                status: appointment_interface_1.AppointmentStatus.SCHEDULED,
            };
            mockAppointmentRepository.getRooms = jest
                .fn()
                .mockResolvedValue([mockRoomModel]);
            mockAppointmentModel.findAll = jest
                .fn()
                .mockResolvedValue([mockAppointment]);
            mockDateHelper.getStartOfDayUTC = jest
                .fn()
                .mockReturnValue(new Date('2024-01-20T00:00:00Z'));
            mockDateHelper.getEndOfDayUTC = jest
                .fn()
                .mockReturnValue(new Date('2024-01-20T23:59:59Z'));
            mockDateHelper.fromISOString = jest.fn().mockReturnValue(appointmentDate);
            mockDateHelper.createUTCDate = jest.fn((year, month, day, hours, minutes) => {
                return new Date(Date.UTC(year, month - 1, day, hours, minutes));
            });
            mockDateHelper.addHoursUTC = jest.fn((date, hours) => {
                const result = new Date(date);
                result.setUTCHours(result.getUTCHours() + hours);
                return result;
            });
            mockDateHelper.addMinutesUTC = jest.fn((date, minutes) => {
                const result = new Date(date);
                result.setUTCMinutes(result.getUTCMinutes() + minutes);
                return result;
            });
            mockDateHelper.extractTimeOnly = jest.fn((date) => {
                const dateObj = typeof date === 'string' ? new Date(date) : date;
                const hours = dateObj.getUTCHours().toString().padStart(2, '0');
                const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');
                return `${hours}:${minutes}`;
            });
            const result = await availableSlotsService.execute({ date: dateString });
            expect(mockAppointmentModel.findAll).toHaveBeenCalled();
            expect(result.slots).toBeDefined();
            expect(Array.isArray(result.slots)).toBe(true);
        });
        it('should filter rooms by roomId when provided', async () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 1);
            const dateString = futureDate.toISOString().split('T')[0];
            mockAppointmentRepository.getRooms = jest.fn().mockResolvedValue([]);
            await availableSlotsService.execute({ date: dateString, roomId: 1 });
            expect(mockAppointmentRepository.getRooms).toHaveBeenCalledWith(1);
        });
        it('should return unique and sorted slots when multiple rooms', async () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 1);
            const dateString = futureDate.toISOString().split('T')[0];
            const mockRoomModel1 = {
                id: 1,
                name: 'Sala A',
                startTime: '08:00',
                endTime: '18:00',
                timeBlock: 30,
                toJSON: () => ({ ...mockRoom, id: 1 }),
            };
            const mockRoomModel2 = {
                id: 2,
                name: 'Sala B',
                startTime: '09:00',
                endTime: '17:00',
                timeBlock: 30,
                toJSON: () => ({ ...mockRoom, id: 2 }),
            };
            mockAppointmentRepository.getRooms = jest
                .fn()
                .mockResolvedValue([mockRoomModel1, mockRoomModel2]);
            mockAppointmentModel.findAll = jest.fn().mockResolvedValue([]);
            mockDateHelper.getStartOfDayUTC = jest
                .fn()
                .mockReturnValue(new Date('2024-01-20T00:00:00Z'));
            mockDateHelper.getEndOfDayUTC = jest
                .fn()
                .mockReturnValue(new Date('2024-01-20T23:59:59Z'));
            mockDateHelper.addMinutesUTC = jest.fn((date, minutes) => {
                const result = new Date(date);
                result.setUTCMinutes(result.getUTCMinutes() + minutes);
                return result;
            });
            mockDateHelper.extractTimeOnly = jest.fn((date) => {
                const dateObj = typeof date === 'string' ? new Date(date) : date;
                const hours = dateObj.getUTCHours().toString().padStart(2, '0');
                const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');
                return `${hours}:${minutes}`;
            });
            const result = await availableSlotsService.execute({ date: dateString });
            expect(result.slots).toEqual([...new Set(result.slots)].sort());
        });
    });
});
//# sourceMappingURL=available-slots.service.test.js.map