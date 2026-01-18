"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_service_1 = require("./create.service");
const appointment_repository_1 = require("../../repositories/appointment.repository");
const logger_service_1 = require("@shared/utils/logger.service");
const appointment_interface_1 = require("@modules/appointments/model/appointment.interface");
// Mocks
jest.mock('../../repositories/appointment.repository');
jest.mock('@shared/utils/logger.service');
describe('CreateAppointmentService', () => {
    let createAppointmentService;
    let mockAppointmentRepository;
    const mockLoggerService = logger_service_1.LoggerService;
    beforeEach(() => {
        mockAppointmentRepository =
            new appointment_repository_1.AppointmentRepository();
        createAppointmentService = new create_service_1.CreateAppointmentService();
        createAppointmentService.appointmentRepository = mockAppointmentRepository;
        jest.clearAllMocks();
    });
    describe('execute', () => {
        const mockAppointment = {
            id: 1,
            userId: 1,
            appointmentDate: new Date('2024-01-20T10:00:00Z'),
            room: 'Sala A',
            status: appointment_interface_1.AppointmentStatus.PENDING,
        };
        it('should successfully create appointment', async () => {
            mockAppointmentRepository.create = jest
                .fn()
                .mockResolvedValue(mockAppointment);
            const result = await createAppointmentService.execute({
                userId: 1,
                appointmentDate: new Date('2024-01-20T10:00:00Z'),
                room: 'Sala A',
            });
            expect(mockAppointmentRepository.create).toHaveBeenCalledWith({
                userId: 1,
                appointmentDate: new Date('2024-01-20T10:00:00Z'),
                room: 'Sala A',
            });
            expect(result.appointment).toEqual(mockAppointment);
            expect(result.appointment.status).toBe(appointment_interface_1.AppointmentStatus.PENDING);
            expect(mockLoggerService.log).toHaveBeenCalledWith('Criação de agendamento', 'Agendamento', 1, expect.stringContaining('Agendamento 1 criado - Sala: Sala A'));
        });
        it('should throw error when repository create returns null', async () => {
            mockAppointmentRepository.create = jest.fn().mockResolvedValue(null);
            await expect(createAppointmentService.execute({
                userId: 1,
                appointmentDate: new Date('2024-01-20T10:00:00Z'),
                room: 'Sala A',
            })).rejects.toThrow('Falha ao criar agendamento');
        });
        it('should log appointment creation with correct details', async () => {
            const appointmentWithUser = {
                ...mockAppointment,
                id: 2,
                room: 'Sala B',
            };
            mockAppointmentRepository.create = jest
                .fn()
                .mockResolvedValue(appointmentWithUser);
            await createAppointmentService.execute({
                userId: 1,
                appointmentDate: new Date('2024-01-21T14:00:00Z'),
                room: 'Sala B',
            });
            expect(mockLoggerService.log).toHaveBeenCalledWith('Criação de agendamento', 'Agendamento', 1, expect.stringContaining('Agendamento 2 criado - Sala: Sala B'));
        });
    });
});
//# sourceMappingURL=create.service.test.js.map