import { AdminListAppointmentsService } from './admin-list.service';
import { AdminListAppointmentsRepository } from './admin-list.repository';
import { IAppointment } from '@modules/appointments/model/appointment.interface';

// Mocks
jest.mock('./admin-list.repository');

describe('AdminListAppointmentsService', () => {
  let adminListAppointmentsService: AdminListAppointmentsService;
  let mockAdminListAppointmentsRepository: jest.Mocked<AdminListAppointmentsRepository>;

  beforeEach(() => {
    mockAdminListAppointmentsRepository =
      new AdminListAppointmentsRepository() as jest.Mocked<AdminListAppointmentsRepository>;
    adminListAppointmentsService = new AdminListAppointmentsService();
    (
      adminListAppointmentsService as unknown as {
        repository: AdminListAppointmentsRepository;
      }
    ).repository = mockAdminListAppointmentsRepository;
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
      mockAdminListAppointmentsRepository.findAll = jest
        .fn()
        .mockResolvedValue({
          appointments: mockAppointments as IAppointment[],
          total: 2,
        });

      const result = await adminListAppointmentsService.execute({});

      expect(mockAdminListAppointmentsRepository.findAll).toHaveBeenCalledWith(
        {}
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockAppointments);
      expect(result.pagination?.page).toBe(1);
      expect(result.pagination?.limit).toBe(10);
      expect(result.pagination?.total).toBe(2);
      expect(result.pagination?.totalPages).toBe(1);
    });

    it('should return paginated appointments with custom filters', async () => {
      mockAdminListAppointmentsRepository.findAll = jest
        .fn()
        .mockResolvedValue({
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

      expect(mockAdminListAppointmentsRepository.findAll).toHaveBeenCalledWith({
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
      mockAdminListAppointmentsRepository.findAll = jest
        .fn()
        .mockResolvedValue({
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
