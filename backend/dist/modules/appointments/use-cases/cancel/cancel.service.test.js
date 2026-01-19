"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cancel_service_1 = require("./cancel.service");
const appointment_repository_1 = require("../../repositories/appointment.repository");
const appointment_model_1 = require("@modules/appointments/model/appointment.model");
const errors_1 = require("@shared/errors");
const logger_service_1 = require("@shared/utils/logger.service");
const appointment_interface_1 = require("@modules/appointments/model/appointment.interface");
// Mocks
jest.mock('../../repositories/appointment.repository');
jest.mock('@modules/appointments/model/appointment.model');
jest.mock('@shared/utils/logger.service');
describe('CancelAppointmentService', () => {
    let cancelAppointmentService;
    let mockAppointmentRepository;
    const mockAppointmentModel = appointment_model_1.AppointmentModel;
    const mockLoggerService = logger_service_1.LoggerService;
    beforeEach(() => {
        mockAppointmentRepository =
            new appointment_repository_1.AppointmentRepository();
        cancelAppointmentService = new cancel_service_1.CancelAppointmentService();
        cancelAppointmentService.appointmentRepository = mockAppointmentRepository;
        jest.clearAllMocks();
    });
    describe('execute', () => {
        const mockAppointment = {
            id: 1,
            userId: 1,
            appointmentDate: new Date('2024-01-20T10:00:00Z'),
            roomId: 1,
            status: appointment_interface_1.AppointmentStatus.SCHEDULED,
        };
        it('should throw NotFoundError when appointment does not exist', async () => {
            mockAppointmentModel.findByPk = jest.fn().mockResolvedValue(null);
            await expect(cancelAppointmentService.execute({
                appointmentId: 999,
                userId: 1,
            })).rejects.toThrow(errors_1.NotFoundError);
            await expect(cancelAppointmentService.execute({
                appointmentId: 999,
                userId: 1,
            })).rejects.toThrow('Agendamento não encontrado');
            expect(mockAppointmentModel.findByPk).toHaveBeenCalledWith(999);
        });
        it('should throw UnauthorizedError when user tries to cancel another user appointment', async () => {
            mockAppointmentModel.findByPk = jest
                .fn()
                .mockResolvedValue(mockAppointment);
            await expect(cancelAppointmentService.execute({
                appointmentId: 1,
                userId: 2,
            })).rejects.toThrow(errors_1.UnauthorizedError);
            await expect(cancelAppointmentService.execute({
                appointmentId: 1,
                userId: 2,
            })).rejects.toThrow('Você só pode cancelar seus próprios agendamentos');
            expect(mockAppointmentModel.findByPk).toHaveBeenCalledWith(1);
        });
        it('should throw BadRequestError when appointment is already cancelled', async () => {
            const cancelledAppointment = {
                ...mockAppointment,
                status: appointment_interface_1.AppointmentStatus.CANCELLED,
            };
            mockAppointmentModel.findByPk = jest
                .fn()
                .mockResolvedValue(cancelledAppointment);
            await expect(cancelAppointmentService.execute({
                appointmentId: 1,
                userId: 1,
            })).rejects.toThrow(errors_1.BadRequestError);
            await expect(cancelAppointmentService.execute({
                appointmentId: 1,
                userId: 1,
            })).rejects.toThrow('O agendamento já está cancelado');
        });
        it('should successfully cancel appointment', async () => {
            const cancelledAppointment = {
                ...mockAppointment,
                status: appointment_interface_1.AppointmentStatus.CANCELLED,
            };
            mockAppointmentModel.findByPk = jest
                .fn()
                .mockResolvedValue(mockAppointment);
            mockAppointmentRepository.cancel = jest
                .fn()
                .mockResolvedValue(cancelledAppointment);
            const result = await cancelAppointmentService.execute({
                appointmentId: 1,
                userId: 1,
            });
            expect(mockAppointmentModel.findByPk).toHaveBeenCalledWith(1);
            expect(mockAppointmentRepository.cancel).toHaveBeenCalledWith({
                appointmentId: 1,
                userId: 1,
            });
            expect(result.appointment).toEqual({
                ...cancelledAppointment,
                appointmentDate: '2024-01-20T10:00:00.000Z',
            });
            expect(result.appointment.status).toBe(appointment_interface_1.AppointmentStatus.CANCELLED);
            expect(mockLoggerService.log).toHaveBeenCalledWith('Cancelamento de agendamento', 'Agendamento', 1, 'Agendamento 1 cancelado pelo usuário');
        });
        it('should throw NotFoundError when repository cancel returns null', async () => {
            mockAppointmentModel.findByPk = jest
                .fn()
                .mockResolvedValue(mockAppointment);
            mockAppointmentRepository.cancel = jest.fn().mockResolvedValue(null);
            await expect(cancelAppointmentService.execute({
                appointmentId: 1,
                userId: 1,
            })).rejects.toThrow(errors_1.NotFoundError);
            await expect(cancelAppointmentService.execute({
                appointmentId: 1,
                userId: 1,
            })).rejects.toThrow('Agendamento não encontrado');
        });
    });
});
//# sourceMappingURL=cancel.service.test.js.map