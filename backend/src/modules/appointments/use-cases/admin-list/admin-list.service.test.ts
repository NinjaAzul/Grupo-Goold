import { AdminListAppointmentsService } from './admin-list.service';
import { AppointmentRepository } from '../../repositories/appointment.repository';
import { IAppointment } from '@modules/appointments/model/appointment.interface';

// Mocks
jest.mock('../../repositories/appointment.repository');

describe('AdminListAppointmentsService', () => {
  let adminListAppointmentsService: AdminListAppointmentsService;
  let mockAppointmentRepository: jest.Mocked<AppointmentRepository>;

  beforeEach(() => {
    mockAppointmentRepository =
      new AppointmentRepository() as jest.Mocked<AppointmentRepository>;
    adminListAppointmentsService = new AdminListAppointmentsService();
    (
      adminListAppointmentsService as unknown as {
        appointmentRepository: AppointmentRepository;
      }
    ).appointmentRepository = mockAppointmentRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const mockAppointments: Partial<IAppointment>[] = [
      {
        id: 1,
        userId: 1,
        appointmentDate: new Date('2024-01-20T10:00:00Z'),
        room: 'Sala A',
      },
      {
        id: 2,
        userId: 2,
        appointmentDate: new Date('2024-01-21T14:00:00Z'),
        room: 'Sala B',
      },
    ];

    it('should return paginated appointments with default values', async () => {
      mockAppointmentRepository.findAllAdmin = jest.fn().mockResolvedValue({
        appointments: mockAppointments as IAppointment[],
        total: 2,
      });

      const result = await adminListAppointmentsService.execute({});

      expect(mockAppointmentRepository.findAllAdmin).toHaveBeenCalledWith({});
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockAppointments);
      expect(result.pagination?.page).toBe(1);
      expect(result.pagination?.limit).toBe(10);
      expect(result.pagination?.total).toBe(2);
      expect(result.pagination?.totalPages).toBe(1);
    });

    it('should return paginated appointments with custom filters', async () => {
      mockAppointmentRepository.findAllAdmin = jest.fn().mockResolvedValue({
        appointments: [mockAppointments[0]] as IAppointment[],
        total: 1,
      });

      const result = await adminListAppointmentsService.execute({
        page: 1,
        limit: 5,
        name: 'John',
        room: 'Sala A',
        status: 'scheduled',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      });

      expect(mockAppointmentRepository.findAllAdmin).toHaveBeenCalledWith({
        page: 1,
        limit: 5,
        name: 'John',
        room: 'Sala A',
        status: 'scheduled',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      });
      expect(result.pagination?.page).toBe(1);
      expect(result.pagination?.limit).toBe(5);
      expect(result.pagination?.total).toBe(1);
      expect(result.pagination?.totalPages).toBe(1);
    });

    it('should handle empty results', async () => {
      mockAppointmentRepository.findAllAdmin = jest.fn().mockResolvedValue({
        appointments: [],
        total: 0,
      });

      const result = await adminListAppointmentsService.execute({});

      expect(result.data).toEqual([]);
      expect(result.pagination?.total).toBe(0);
      expect(result.pagination?.totalPages).toBe(0);
    });
  });
});
