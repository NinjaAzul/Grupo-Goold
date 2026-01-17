import { ListAppointmentsService } from './list.service';
import { ListAppointmentsRepository } from './list.repository';
import { IAppointment } from '@modules/appointments/model/appointment.interface';

// Mocks
jest.mock('./list.repository');

describe('ListAppointmentsService', () => {
  let listAppointmentsService: ListAppointmentsService;
  let mockListAppointmentsRepository: jest.Mocked<ListAppointmentsRepository>;

  beforeEach(() => {
    mockListAppointmentsRepository =
      new ListAppointmentsRepository() as jest.Mocked<ListAppointmentsRepository>;
    listAppointmentsService = new ListAppointmentsService();
    (
      listAppointmentsService as unknown as {
        repository: ListAppointmentsRepository;
      }
    ).repository = mockListAppointmentsRepository;
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
        userId: 1,
        appointmentDate: new Date('2024-01-21T14:00:00Z'),
        room: 'Sala B',
      },
    ];

    it('should return paginated appointments with default values', async () => {
      mockListAppointmentsRepository.list = jest.fn().mockResolvedValue({
        rows: mockAppointments as IAppointment[],
        count: 2,
      });

      const result = await listAppointmentsService.execute({
        userId: 1,
      });

      expect(mockListAppointmentsRepository.list).toHaveBeenCalledWith({
        userId: 1,
        page: undefined,
        limit: undefined,
        name: undefined,
        startDate: undefined,
        endDate: undefined,
        status: undefined,
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockAppointments);
      expect(result.pagination?.page).toBe(1);
      expect(result.pagination?.limit).toBe(10);
      expect(result.pagination?.total).toBe(2);
      expect(result.pagination?.totalPages).toBe(1);
    });

    it('should return paginated appointments with custom page and limit', async () => {
      mockListAppointmentsRepository.list = jest.fn().mockResolvedValue({
        rows: [mockAppointments[0]] as IAppointment[],
        count: 2,
      });

      const result = await listAppointmentsService.execute({
        userId: 1,
        page: 1,
        limit: 1,
      });

      expect(result.pagination?.page).toBe(1);
      expect(result.pagination?.limit).toBe(1);
      expect(result.pagination?.total).toBe(2);
      expect(result.pagination?.totalPages).toBe(2);
    });

    it('should pass filters to repository', async () => {
      mockListAppointmentsRepository.list = jest.fn().mockResolvedValue({
        rows: mockAppointments as IAppointment[],
        count: 2,
      });

      await listAppointmentsService.execute({
        userId: 1,
        page: 2,
        limit: 5,
        name: 'John',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        status: 'scheduled',
      });

      expect(mockListAppointmentsRepository.list).toHaveBeenCalledWith({
        userId: 1,
        page: 2,
        limit: 5,
        name: 'John',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        status: 'scheduled',
      });
    });

    it('should handle empty results', async () => {
      mockListAppointmentsRepository.list = jest.fn().mockResolvedValue({
        rows: [],
        count: 0,
      });

      const result = await listAppointmentsService.execute({
        userId: 1,
      });

      expect(result.data).toEqual([]);
      expect(result.pagination?.total).toBe(0);
      expect(result.pagination?.totalPages).toBe(0);
    });
  });
});
