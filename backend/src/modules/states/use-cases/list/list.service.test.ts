import { ListStatesService } from './list.service';
import { ListStatesRepository } from './list.repository';
import { IState } from '@modules/states/model/state.interface';

// Mocks
jest.mock('./list.repository');

describe('ListStatesService', () => {
  let listStatesService: ListStatesService;
  let mockListStatesRepository: jest.Mocked<ListStatesRepository>;

  beforeEach(() => {
    mockListStatesRepository =
      new ListStatesRepository() as jest.Mocked<ListStatesRepository>;
    listStatesService = new ListStatesService();
    (
      listStatesService as unknown as {
        listStatesRepository: ListStatesRepository;
      }
    ).listStatesRepository = mockListStatesRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const mockStates: Partial<IState>[] = [
      {
        id: 35,
        name: 'São Paulo',
        uf: 'SP',
      },
      {
        id: 33,
        name: 'Rio de Janeiro',
        uf: 'RJ',
      },
    ];

    it('should return all states', async () => {
      mockListStatesRepository.findAll = jest
        .fn()
        .mockResolvedValue(mockStates as IState[]);

      const result = await listStatesService.execute();

      expect(mockListStatesRepository.findAll).toHaveBeenCalled();
      expect(result.states).toEqual(mockStates);
      expect(result.total).toBe(2);
    });

    it('should handle empty results', async () => {
      mockListStatesRepository.findAll = jest.fn().mockResolvedValue([]);

      const result = await listStatesService.execute();

      expect(result.states).toEqual([]);
      expect(result.total).toBe(0);
    });
  });
});
