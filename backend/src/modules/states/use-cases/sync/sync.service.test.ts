import { SyncStatesService } from './sync.service';
import { StateRepository } from '../../repositories/state.repository';
import { ibgeApi } from '@shared/integrations';
import { InternalServerError } from '@shared/errors';
import { logger } from '@shared/utils';

// Mocks
jest.mock('../../repositories/state.repository');
jest.mock('@shared/integrations');
jest.mock('@shared/utils', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('SyncStatesService', () => {
  let syncStatesService: SyncStatesService;
  let mockStateRepository: jest.Mocked<StateRepository>;
  const mockIbgeApi = ibgeApi as jest.Mocked<typeof ibgeApi>;
  const mockLogger = logger as jest.Mocked<typeof logger>;

  beforeEach(() => {
    mockStateRepository = new StateRepository() as jest.Mocked<StateRepository>;
    syncStatesService = new SyncStatesService();
    (
      syncStatesService as unknown as {
        stateRepository: StateRepository;
      }
    ).stateRepository = mockStateRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const mockIBGEStates = [
      {
        id: 35,
        sigla: 'SP',
        nome: 'São Paulo',
        regiao: { id: 3, sigla: 'SE', nome: 'Sudeste' },
      },
      {
        id: 33,
        sigla: 'RJ',
        nome: 'Rio de Janeiro',
        regiao: { id: 3, sigla: 'SE', nome: 'Sudeste' },
      },
    ];

    const mockIBGECitiesSP = [
      {
        id: 3550308,
        nome: 'São Paulo',
        microrregiao: {
          id: 35061,
          nome: 'São Paulo',
          mesorregiao: {
            id: 3515,
            nome: 'Metropolitana de São Paulo',
            UF: { id: 35, sigla: 'SP', nome: 'São Paulo' },
          },
        },
      },
    ];

    const mockIBGECitiesRJ = [
      {
        id: 3304557,
        nome: 'Rio de Janeiro',
        microrregiao: {
          id: 33018,
          nome: 'Rio de Janeiro',
          mesorregiao: {
            id: 3301,
            nome: 'Metropolitana do Rio de Janeiro',
            UF: { id: 33, sigla: 'RJ', nome: 'Rio de Janeiro' },
          },
        },
      },
    ];

    it('should successfully synchronize states and cities', async () => {
      mockIbgeApi.getStates = jest.fn().mockResolvedValue(mockIBGEStates);
      mockIbgeApi.getCitiesByState = jest
        .fn()
        .mockResolvedValueOnce(mockIBGECitiesSP)
        .mockResolvedValueOnce(mockIBGECitiesRJ);
      mockStateRepository.bulkCreateStates = jest.fn().mockResolvedValue(2);
      mockStateRepository.bulkCreateCities = jest
        .fn()
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(1);

      const result = await syncStatesService.execute();

      expect(mockIbgeApi.getStates).toHaveBeenCalled();
      expect(mockIbgeApi.getCitiesByState).toHaveBeenCalledWith('SP');
      expect(mockIbgeApi.getCitiesByState).toHaveBeenCalledWith('RJ');
      expect(mockStateRepository.bulkCreateStates).toHaveBeenCalledWith([
        { id: 35, name: 'São Paulo', uf: 'SP' },
        { id: 33, name: 'Rio de Janeiro', uf: 'RJ' },
      ]);
      expect(mockStateRepository.bulkCreateCities).toHaveBeenCalledWith([
        { id: 3550308, name: 'São Paulo', stateId: 35 },
      ]);
      expect(mockStateRepository.bulkCreateCities).toHaveBeenCalledWith([
        { id: 3304557, name: 'Rio de Janeiro', stateId: 33 },
      ]);
      expect(result.statesCount).toBe(2);
      expect(result.citiesCount).toBe(2);
      expect(result.message).toBe(
        'Successfully synchronized 2 states and 2 cities'
      );
    });

    it('should handle errors when fetching states from IBGE API', async () => {
      mockIbgeApi.getStates = jest
        .fn()
        .mockRejectedValue(new Error('IBGE API error'));

      await expect(syncStatesService.execute()).rejects.toThrow(
        InternalServerError
      );
      await expect(syncStatesService.execute()).rejects.toThrow(
        'Falha ao sincronizar estados e cidades'
      );

      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should handle errors when fetching cities for a state', async () => {
      mockIbgeApi.getStates = jest.fn().mockResolvedValue(mockIBGEStates);
      mockIbgeApi.getCitiesByState = jest
        .fn()
        .mockRejectedValueOnce(new Error('Cities API error'))
        .mockResolvedValueOnce(mockIBGECitiesRJ);
      mockStateRepository.bulkCreateStates = jest.fn().mockResolvedValue(2);
      mockStateRepository.bulkCreateCities = jest.fn().mockResolvedValueOnce(1);

      const result = await syncStatesService.execute();

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error synchronizing cities for state SP:',
        expect.any(Error)
      );
      expect(result.citiesCount).toBe(1);
    });

    it('should log synchronization progress', async () => {
      mockIbgeApi.getStates = jest.fn().mockResolvedValue(mockIBGEStates);
      mockIbgeApi.getCitiesByState = jest
        .fn()
        .mockResolvedValueOnce(mockIBGECitiesSP)
        .mockResolvedValueOnce(mockIBGECitiesRJ);
      mockStateRepository.bulkCreateStates = jest.fn().mockResolvedValue(2);
      mockStateRepository.bulkCreateCities = jest
        .fn()
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(1);

      await syncStatesService.execute();

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Starting states and cities synchronization...'
      );
      expect(mockLogger.info).toHaveBeenCalledWith('Synchronized 2 states');
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Synchronized 1 cities for state SP'
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Synchronized 1 cities for state RJ'
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Synchronization completed: 2 states, 2 cities'
      );
    });
  });
});
