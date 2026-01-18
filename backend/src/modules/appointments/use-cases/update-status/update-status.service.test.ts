import { UpdateStatusService } from './update-status.service';
import { AppointmentRepository } from '../../repositories/appointment.repository';
import { LoggerService } from '@shared/utils/logger.service';
import { AppointmentStatus } from '@modules/appointments/model/appointment.interface';
import { IAppointment } from '@modules/appointments/model/appointment.interface';

// Mocks
jest.mock('../../repositories/appointment.repository');
jest.mock('@shared/utils/logger.service');

describe('UpdateStatusService', () => {
  let updateStatusService: UpdateStatusService;
  let mockAppointmentRepository: jest.Mocked<AppointmentRepository>;
  const mockLoggerService = LoggerService as jest.Mocked<typeof LoggerService>;

  beforeEach(() => {
    mockAppointmentRepository =
      new AppointmentRepository() as jest.Mocked<AppointmentRepository>;
    updateStatusService = new UpdateStatusService();
    (
      updateStatusService as unknown as {
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
      room: 'Sala A',
      status: AppointmentStatus.PENDING,
    };

    it('should update status to scheduled and log as creation', async () => {
      const updatedAppointment: Partial<IAppointment> = {
        ...mockAppointment,
        status: AppointmentStatus.SCHEDULED,
      };

      mockAppointmentRepository.updateStatus = jest
        .fn()
        .mockResolvedValue(updatedAppointment as IAppointment);

      const result = await updateStatusService.execute({
        appointmentId: 1,
        status: AppointmentStatus.SCHEDULED,
      });

      expect(mockAppointmentRepository.updateStatus).toHaveBeenCalledWith(
        1,
        AppointmentStatus.SCHEDULED
      );
      expect(result.appointment).toEqual(updatedAppointment);
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Criação de agendamento',
        'Agendamento',
        1,
        'Agendamento 1 - Status: scheduled'
      );
    });

    it('should update status to cancelled and log as cancellation', async () => {
      const updatedAppointment: Partial<IAppointment> = {
        ...mockAppointment,
        status: AppointmentStatus.CANCELLED,
      };

      mockAppointmentRepository.updateStatus = jest
        .fn()
        .mockResolvedValue(updatedAppointment as IAppointment);

      const result = await updateStatusService.execute({
        appointmentId: 1,
        status: AppointmentStatus.CANCELLED,
      });

      expect(mockAppointmentRepository.updateStatus).toHaveBeenCalledWith(
        1,
        AppointmentStatus.CANCELLED
      );
      expect(result.appointment).toEqual(updatedAppointment);
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Cancelamento de agendamento',
        'Agendamento',
        1,
        'Agendamento 1 - Status: cancelled'
      );
    });

    it('should update status to pending and log as update', async () => {
      const updatedAppointment: Partial<IAppointment> = {
        ...mockAppointment,
        status: AppointmentStatus.PENDING,
      };

      mockAppointmentRepository.updateStatus = jest
        .fn()
        .mockResolvedValue(updatedAppointment as IAppointment);

      const result = await updateStatusService.execute({
        appointmentId: 1,
        status: AppointmentStatus.PENDING,
      });

      expect(mockAppointmentRepository.updateStatus).toHaveBeenCalledWith(
        1,
        AppointmentStatus.PENDING
      );
      expect(result.appointment).toEqual(updatedAppointment);
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Atualização de agendamento',
        'Agendamento',
        1,
        'Agendamento 1 - Status: pending'
      );
    });

    it('should use adminUserId in log when provided', async () => {
      const updatedAppointment: Partial<IAppointment> = {
        ...mockAppointment,
        status: AppointmentStatus.SCHEDULED,
      };

      mockAppointmentRepository.updateStatus = jest
        .fn()
        .mockResolvedValue(updatedAppointment as IAppointment);

      const result = await updateStatusService.execute({
        appointmentId: 1,
        status: AppointmentStatus.SCHEDULED,
        adminUserId: 2,
      });

      expect(result.appointment).toEqual(updatedAppointment);
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Criação de agendamento',
        'Agendamento',
        2,
        'Agendamento 1 - Status: scheduled (Ação realizada por admin)'
      );
    });

    it('should use appointment userId when adminUserId is not provided', async () => {
      const updatedAppointment: Partial<IAppointment> = {
        ...mockAppointment,
        userId: 3,
        status: AppointmentStatus.CANCELLED,
      };

      mockAppointmentRepository.updateStatus = jest
        .fn()
        .mockResolvedValue(updatedAppointment as IAppointment);

      await updateStatusService.execute({
        appointmentId: 1,
        status: AppointmentStatus.CANCELLED,
      });

      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Cancelamento de agendamento',
        'Agendamento',
        3,
        'Agendamento 1 - Status: cancelled'
      );
    });
  });
});
