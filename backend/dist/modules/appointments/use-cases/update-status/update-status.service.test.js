"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const update_status_service_1 = require("./update-status.service");
const appointment_repository_1 = require("../../repositories/appointment.repository");
const logger_service_1 = require("@shared/utils/logger.service");
const appointment_interface_1 = require("@modules/appointments/model/appointment.interface");
// Mocks
jest.mock('../../repositories/appointment.repository');
jest.mock('@shared/utils/logger.service');
describe('UpdateStatusService', () => {
    let updateStatusService;
    let mockAppointmentRepository;
    const mockLoggerService = logger_service_1.LoggerService;
    beforeEach(() => {
        mockAppointmentRepository =
            new appointment_repository_1.AppointmentRepository();
        updateStatusService = new update_status_service_1.UpdateStatusService();
        updateStatusService.appointmentRepository = mockAppointmentRepository;
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
        it('should update status to scheduled and log as creation', async () => {
            const updatedAppointment = {
                ...mockAppointment,
                status: appointment_interface_1.AppointmentStatus.SCHEDULED,
            };
            mockAppointmentRepository.updateStatus = jest
                .fn()
                .mockResolvedValue(updatedAppointment);
            const result = await updateStatusService.execute({
                appointmentId: 1,
                status: appointment_interface_1.AppointmentStatus.SCHEDULED,
            });
            expect(mockAppointmentRepository.updateStatus).toHaveBeenCalledWith(1, appointment_interface_1.AppointmentStatus.SCHEDULED);
            expect(result.appointment).toEqual(updatedAppointment);
            expect(mockLoggerService.log).toHaveBeenCalledWith('Criação de agendamento', 'Agendamento', 1, 'Agendamento 1 - Status: scheduled');
        });
        it('should update status to cancelled and log as cancellation', async () => {
            const updatedAppointment = {
                ...mockAppointment,
                status: appointment_interface_1.AppointmentStatus.CANCELLED,
            };
            mockAppointmentRepository.updateStatus = jest
                .fn()
                .mockResolvedValue(updatedAppointment);
            const result = await updateStatusService.execute({
                appointmentId: 1,
                status: appointment_interface_1.AppointmentStatus.CANCELLED,
            });
            expect(mockAppointmentRepository.updateStatus).toHaveBeenCalledWith(1, appointment_interface_1.AppointmentStatus.CANCELLED);
            expect(result.appointment).toEqual(updatedAppointment);
            expect(mockLoggerService.log).toHaveBeenCalledWith('Cancelamento de agendamento', 'Agendamento', 1, 'Agendamento 1 - Status: cancelled');
        });
        it('should update status to pending and log as update', async () => {
            const updatedAppointment = {
                ...mockAppointment,
                status: appointment_interface_1.AppointmentStatus.PENDING,
            };
            mockAppointmentRepository.updateStatus = jest
                .fn()
                .mockResolvedValue(updatedAppointment);
            const result = await updateStatusService.execute({
                appointmentId: 1,
                status: appointment_interface_1.AppointmentStatus.PENDING,
            });
            expect(mockAppointmentRepository.updateStatus).toHaveBeenCalledWith(1, appointment_interface_1.AppointmentStatus.PENDING);
            expect(result.appointment).toEqual(updatedAppointment);
            expect(mockLoggerService.log).toHaveBeenCalledWith('Atualização de agendamento', 'Agendamento', 1, 'Agendamento 1 - Status: pending');
        });
        it('should use adminUserId in log when provided', async () => {
            const updatedAppointment = {
                ...mockAppointment,
                status: appointment_interface_1.AppointmentStatus.SCHEDULED,
            };
            mockAppointmentRepository.updateStatus = jest
                .fn()
                .mockResolvedValue(updatedAppointment);
            const result = await updateStatusService.execute({
                appointmentId: 1,
                status: appointment_interface_1.AppointmentStatus.SCHEDULED,
                adminUserId: 2,
            });
            expect(result.appointment).toEqual(updatedAppointment);
            expect(mockLoggerService.log).toHaveBeenCalledWith('Criação de agendamento', 'Agendamento', 2, 'Agendamento 1 - Status: scheduled (Ação realizada por admin)');
        });
        it('should use appointment userId when adminUserId is not provided', async () => {
            const updatedAppointment = {
                ...mockAppointment,
                userId: 3,
                status: appointment_interface_1.AppointmentStatus.CANCELLED,
            };
            mockAppointmentRepository.updateStatus = jest
                .fn()
                .mockResolvedValue(updatedAppointment);
            await updateStatusService.execute({
                appointmentId: 1,
                status: appointment_interface_1.AppointmentStatus.CANCELLED,
            });
            expect(mockLoggerService.log).toHaveBeenCalledWith('Cancelamento de agendamento', 'Agendamento', 3, 'Agendamento 1 - Status: cancelled');
        });
    });
});
//# sourceMappingURL=update-status.service.test.js.map