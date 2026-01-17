import { CancelAppointmentService } from './cancel.service';
import { CancelAppointmentRepository } from './cancel.repository';
import { AppointmentModel } from '@modules/appointments/model/appointment.model';
import {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from '@shared/errors';
import { LoggerService } from '@shared/utils/logger.service';
import { AppointmentStatus } from '@modules/appointments/model/appointment.interface';
import { IAppointment } from '@modules/appointments/model/appointment.interface';

// Mocks
jest.mock('./cancel.repository');
jest.mock('@modules/appointments/model/appointment.model');
jest.mock('@shared/utils/logger.service');

describe('CancelAppointmentService', () => {
  let cancelAppointmentService: CancelAppointmentService;
  let mockCancelAppointmentRepository: jest.Mocked<CancelAppointmentRepository>;
  const mockAppointmentModel = AppointmentModel as jest.Mocked<
    typeof AppointmentModel
  >;
  const mockLoggerService = LoggerService as jest.Mocked<typeof LoggerService>;

  beforeEach(() => {
    mockCancelAppointmentRepository =
      new CancelAppointmentRepository() as jest.Mocked<CancelAppointmentRepository>;
    cancelAppointmentService = new CancelAppointmentService();
    (
      cancelAppointmentService as unknown as {
        repository: CancelAppointmentRepository;
      }
    ).repository = mockCancelAppointmentRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const mockAppointment: Partial<IAppointment> = {
      id: 1,
      userId: 1,
      appointmentDate: new Date('2024-01-20T10:00:00Z'),
      room: 'Sala A',
      status: AppointmentStatus.SCHEDULED,
    };

    it('should throw NotFoundError when appointment does not exist', async () => {
      mockAppointmentModel.findByPk = jest.fn().mockResolvedValue(null);

      await expect(
        cancelAppointmentService.execute({
          appointmentId: 999,
          userId: 1,
        })
      ).rejects.toThrow(NotFoundError);
      await expect(
        cancelAppointmentService.execute({
          appointmentId: 999,
          userId: 1,
        })
      ).rejects.toThrow('Appointment not found');

      expect(mockAppointmentModel.findByPk).toHaveBeenCalledWith(999);
    });

    it('should throw UnauthorizedError when user tries to cancel another user appointment', async () => {
      mockAppointmentModel.findByPk = jest
        .fn()
        .mockResolvedValue(mockAppointment as IAppointment);

      await expect(
        cancelAppointmentService.execute({
          appointmentId: 1,
          userId: 2,
        })
      ).rejects.toThrow(UnauthorizedError);
      await expect(
        cancelAppointmentService.execute({
          appointmentId: 1,
          userId: 2,
        })
      ).rejects.toThrow('You can only cancel your own appointments');

      expect(mockAppointmentModel.findByPk).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestError when appointment is already cancelled', async () => {
      const cancelledAppointment: Partial<IAppointment> = {
        ...mockAppointment,
        status: AppointmentStatus.CANCELLED,
      };
      mockAppointmentModel.findByPk = jest
        .fn()
        .mockResolvedValue(cancelledAppointment as IAppointment);

      await expect(
        cancelAppointmentService.execute({
          appointmentId: 1,
          userId: 1,
        })
      ).rejects.toThrow(BadRequestError);
      await expect(
        cancelAppointmentService.execute({
          appointmentId: 1,
          userId: 1,
        })
      ).rejects.toThrow('Appointment is already cancelled');
    });

    it('should successfully cancel appointment', async () => {
      const cancelledAppointment: Partial<IAppointment> = {
        ...mockAppointment,
        status: AppointmentStatus.CANCELLED,
      };

      mockAppointmentModel.findByPk = jest
        .fn()
        .mockResolvedValue(mockAppointment as IAppointment);
      mockCancelAppointmentRepository.cancel = jest
        .fn()
        .mockResolvedValue(cancelledAppointment as IAppointment);

      const result = await cancelAppointmentService.execute({
        appointmentId: 1,
        userId: 1,
      });

      expect(mockAppointmentModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockCancelAppointmentRepository.cancel).toHaveBeenCalledWith({
        appointmentId: 1,
        userId: 1,
      });
      expect(result.appointment).toEqual(cancelledAppointment);
      expect(result.appointment.status).toBe(AppointmentStatus.CANCELLED);
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Cancelamento de agendamento',
        'Agendamento',
        1,
        'Agendamento 1 cancelado pelo usuário'
      );
    });

    it('should throw NotFoundError when repository cancel returns null', async () => {
      mockAppointmentModel.findByPk = jest
        .fn()
        .mockResolvedValue(mockAppointment as IAppointment);
      mockCancelAppointmentRepository.cancel = jest
        .fn()
        .mockResolvedValue(null);

      await expect(
        cancelAppointmentService.execute({
          appointmentId: 1,
          userId: 1,
        })
      ).rejects.toThrow(NotFoundError);
      await expect(
        cancelAppointmentService.execute({
          appointmentId: 1,
          userId: 1,
        })
      ).rejects.toThrow('Appointment not found');
    });
  });
});
