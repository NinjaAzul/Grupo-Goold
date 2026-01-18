"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sync_service_1 = require("./sync.service");
const state_repository_1 = require("../../repositories/state.repository");
const integrations_1 = require("@shared/integrations");
const errors_1 = require("@shared/errors");
const utils_1 = require("@shared/utils");
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
    let syncStatesService;
    let mockStateRepository;
    const mockIbgeApi = integrations_1.ibgeApi;
    const mockLogger = utils_1.logger;
    beforeEach(() => {
        mockStateRepository = new state_repository_1.StateRepository();
        syncStatesService = new sync_service_1.SyncStatesService();
        syncStatesService.stateRepository = mockStateRepository;
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
            expect(result.message).toBe('Successfully synchronized 2 states and 2 cities');
        });
        it('should handle errors when fetching states from IBGE API', async () => {
            mockIbgeApi.getStates = jest
                .fn()
                .mockRejectedValue(new Error('IBGE API error'));
            await expect(syncStatesService.execute()).rejects.toThrow(errors_1.InternalServerError);
            await expect(syncStatesService.execute()).rejects.toThrow('Falha ao sincronizar estados e cidades');
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
            expect(mockLogger.error).toHaveBeenCalledWith('Error synchronizing cities for state SP:', expect.any(Error));
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
            expect(mockLogger.info).toHaveBeenCalledWith('Starting states and cities synchronization...');
            expect(mockLogger.info).toHaveBeenCalledWith('Synchronized 2 states');
            expect(mockLogger.info).toHaveBeenCalledWith('Synchronized 1 cities for state SP');
            expect(mockLogger.info).toHaveBeenCalledWith('Synchronized 1 cities for state RJ');
            expect(mockLogger.info).toHaveBeenCalledWith('Synchronization completed: 2 states, 2 cities');
        });
    });
});
//# sourceMappingURL=sync.service.test.js.map