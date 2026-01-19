import { CancelAppointmentService } from './cancel.service';
import { AppointmentRepository } from '../../repositories/appointment.repository';
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
jest.mock('../../repositories/appointment.repository');
jest.mock('@modules/appointments/model/appointment.model');
jest.mock('@shared/utils/logger.service');

describe('CancelAppointmentService', () => {
  let cancelAppointmentService: CancelAppointmentService;
  let mockAppointmentRepository: jest.Mocked<AppointmentRepository>;
  const mockAppointmentModel = AppointmentModel as jest.Mocked<
    typeof AppointmentModel
  >;
  const mockLoggerService = LoggerService as jest.Mocked<typeof LoggerService>;

  beforeEach(() => {
    mockAppointmentRepository =
      new AppointmentRepository() as jest.Mocked<AppointmentRepository>;
    cancelAppointmentService = new CancelAppointmentService();
    (
      cancelAppointmentService as unknown as {
        appointmentRepository: AppointmentRepository;
      }
    ).appointmentRepository = mockAppointmentRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const mockAppointment: Partial<IAppointment> = {
      id: 1,
      userId: 1,
      appointmentDate: new Date('2024-01-20T10:00:00Z'),
      roomId: 1,
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
      ).rejects.toThrow('Agendamento não encontrado');

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
      ).rejects.toThrow('Você só pode cancelar seus próprios agendamentos');

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
      ).rejects.toThrow('O agendamento já está cancelado');
    });

    it('should successfully cancel appointment', async () => {
      const cancelledAppointment: Partial<IAppointment> = {
        ...mockAppointment,
        status: AppointmentStatus.CANCELLED,
      };

      mockAppointmentModel.findByPk = jest
        .fn()
        .mockResolvedValue(mockAppointment as IAppointment);
      mockAppointmentRepository.cancel = jest
        .fn()
        .mockResolvedValue(cancelledAppointment as IAppointment);

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
      mockAppointmentRepository.cancel = jest.fn().mockResolvedValue(null);

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
      ).rejects.toThrow('Agendamento não encontrado');
    });
  });
});
