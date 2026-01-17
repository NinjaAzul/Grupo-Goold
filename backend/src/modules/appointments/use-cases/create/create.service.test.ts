import { CreateAppointmentService } from './create.service';
import { CreateAppointmentRepository } from './create.repository';
import { LoggerService } from '@shared/utils/logger.service';
import { AppointmentStatus } from '@modules/appointments/model/appointment.interface';
import { IAppointment } from '@modules/appointments/model/appointment.interface';

// Mocks
jest.mock('./create.repository');
jest.mock('@shared/utils/logger.service');

describe('CreateAppointmentService', () => {
  let createAppointmentService: CreateAppointmentService;
  let mockCreateAppointmentRepository: jest.Mocked<CreateAppointmentRepository>;
  const mockLoggerService = LoggerService as jest.Mocked<typeof LoggerService>;

  beforeEach(() => {
    mockCreateAppointmentRepository =
      new CreateAppointmentRepository() as jest.Mocked<CreateAppointmentRepository>;
    createAppointmentService = new CreateAppointmentService();
    (
      createAppointmentService as unknown as {
        repository: CreateAppointmentRepository;
      }
    ).repository = mockCreateAppointmentRepository;
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

    it('should successfully create appointment', async () => {
      mockCreateAppointmentRepository.create = jest
        .fn()
        .mockResolvedValue(mockAppointment as IAppointment);

      const result = await createAppointmentService.execute({
        userId: 1,
        appointmentDate: new Date('2024-01-20T10:00:00Z'),
        room: 'Sala A',
      });

      expect(mockCreateAppointmentRepository.create).toHaveBeenCalledWith({
        userId: 1,
        appointmentDate: new Date('2024-01-20T10:00:00Z'),
        room: 'Sala A',
      });
      expect(result.appointment).toEqual(mockAppointment);
      expect(result.appointment.status).toBe(AppointmentStatus.PENDING);
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Criação de agendamento',
        'Agendamento',
        1,
        expect.stringContaining('Agendamento 1 criado - Sala: Sala A')
      );
    });

    it('should throw error when repository create returns null', async () => {
      mockCreateAppointmentRepository.create = jest
        .fn()
        .mockResolvedValue(null);

      await expect(
        createAppointmentService.execute({
          userId: 1,
          appointmentDate: new Date('2024-01-20T10:00:00Z'),
          room: 'Sala A',
        })
      ).rejects.toThrow('Failed to create appointment');
    });

    it('should log appointment creation with correct details', async () => {
      const appointmentWithUser: Partial<IAppointment> = {
        ...mockAppointment,
        id: 2,
        room: 'Sala B',
      };

      mockCreateAppointmentRepository.create = jest
        .fn()
        .mockResolvedValue(appointmentWithUser as IAppointment);

      await createAppointmentService.execute({
        userId: 1,
        appointmentDate: new Date('2024-01-21T14:00:00Z'),
        room: 'Sala B',
      });

      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Criação de agendamento',
        'Agendamento',
        1,
        expect.stringContaining('Agendamento 2 criado - Sala: Sala B')
      );
    });
  });
});
