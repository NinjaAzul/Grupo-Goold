import { ListStatesService } from './list.service';
import { StateRepository } from '../../repositories/state.repository';
import { IState } from '@modules/states/model/state.interface';

// Mocks
jest.mock('../../repositories/state.repository');

describe('ListStatesService', () => {
  let listStatesService: ListStatesService;
  let mockStateRepository: jest.Mocked<StateRepository>;

  beforeEach(() => {
    mockStateRepository = new StateRepository() as jest.Mocked<StateRepository>;
    listStatesService = new ListStatesService();
    (
      listStatesService as unknown as {
        stateRepository: StateRepository;
      }
    ).stateRepository = mockStateRepository;
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
      mockStateRepository.findAll = jest
        .fn()
        .mockResolvedValue(mockStates as IState[]);

      const result = await listStatesService.execute();

      expect(mockStateRepository.findAll).toHaveBeenCalled();
      expect(result.states).toEqual(mockStates);
      expect(result.total).toBe(2);
    });

    it('should handle empty results', async () => {
      mockStateRepository.findAll = jest.fn().mockResolvedValue([]);

      const result = await listStatesService.execute();

      expect(result.states).toEqual([]);
      expect(result.total).toBe(0);
    });
  });
});
