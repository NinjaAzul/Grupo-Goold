import { ListLogsService } from './list.service';
import { LogRepository } from '../../repositories/log.repository';
import { ILog } from '@modules/logs/model/log.interface';

// Mocks
jest.mock('../../repositories/log.repository');

describe('ListLogsService', () => {
  let listLogsService: ListLogsService;
  let mockLogRepository: jest.Mocked<LogRepository>;

  beforeEach(() => {
    mockLogRepository = new LogRepository() as jest.Mocked<LogRepository>;
    listLogsService = new ListLogsService();
    (
      listLogsService as unknown as { logRepository: LogRepository }
    ).logRepository = mockLogRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const mockLogs: Partial<ILog>[] = [
      {
        id: 1,
        userId: 1,
        activityType: 'Criação de agendamento',
        module: 'Agendamento',
        description: 'Agendamento criado',
      },
      {
        id: 2,
        userId: 2,
        activityType: 'Atualização de usuário',
        module: 'Usuário',
        description: 'Usuário atualizado',
      },
    ];

    it('should return paginated logs with default values', async () => {
      mockLogRepository.findAll = jest.fn().mockResolvedValue({
        logs: mockLogs as ILog[],
        total: 2,
      });

      const result = await listLogsService.execute({});

      expect(mockLogRepository.findAll).toHaveBeenCalledWith({});
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockLogs);
      expect(result.pagination?.page).toBe(1);
      expect(result.pagination?.limit).toBe(10);
      expect(result.pagination?.total).toBe(2);
      expect(result.pagination?.totalPages).toBe(1);
    });

    it('should return paginated logs with custom filters', async () => {
      mockLogRepository.findAll = jest.fn().mockResolvedValue({
        logs: [mockLogs[0]] as ILog[],
        total: 1,
      });

      const result = await listLogsService.execute({
        page: 1,
        limit: 5,
        userId: 1,
        activityType: 'Criação',
        module: 'Agendamento',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      });

      expect(mockLogRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 5,
        userId: 1,
        activityType: 'Criação',
        module: 'Agendamento',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      });
      expect(result.pagination?.page).toBe(1);
      expect(result.pagination?.limit).toBe(5);
      expect(result.pagination?.total).toBe(1);
      expect(result.pagination?.totalPages).toBe(1);
    });

    it('should handle empty results', async () => {
      mockLogRepository.findAll = jest.fn().mockResolvedValue({
        logs: [],
        total: 0,
      });

      const result = await listLogsService.execute({});

      expect(result.data).toEqual([]);
      expect(result.pagination?.total).toBe(0);
      expect(result.pagination?.totalPages).toBe(0);
    });
  });
});
