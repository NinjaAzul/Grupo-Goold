"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search_by_cep_service_1 = require("./search-by-cep.service");
const city_repository_1 = require("../../repositories/city.repository");
const integrations_1 = require("@shared/integrations");
const errors_1 = require("@shared/errors");
// Mocks
jest.mock('../../repositories/city.repository');
jest.mock('@shared/integrations');
describe('SearchByCEPService', () => {
    let searchByCEPService;
    let mockCityRepository;
    const mockViaCepApi = integrations_1.viaCepApi;
    beforeEach(() => {
        mockCityRepository = new city_repository_1.CityRepository();
        searchByCEPService = new search_by_cep_service_1.SearchByCEPService();
        searchByCEPService.cityRepository = mockCityRepository;
        jest.clearAllMocks();
    });
    describe('execute', () => {
        const mockViaCEPData = {
            cep: '01310-100',
            logradouro: 'Avenida Paulista',
            complemento: 'lado ímpar',
            bairro: 'Bela Vista',
            localidade: 'São Paulo',
            uf: 'SP',
            ibge: '3550308',
            gia: '1004',
            ddd: '11',
            siafi: '7107',
        };
        const mockCityWithState = {
            id: 3550308,
            name: 'São Paulo',
            stateId: 35,
            state: {
                id: 35,
                name: 'São Paulo',
                uf: 'SP',
            },
        };
        it('should throw NotFoundError when city is not found in database', async () => {
            mockViaCepApi.getAddressByCEP = jest
                .fn()
                .mockResolvedValue(mockViaCEPData);
            mockCityRepository.findCityByIBGECode = jest.fn().mockResolvedValue(null);
            await expect(searchByCEPService.execute('01310-100')).rejects.toThrow(errors_1.NotFoundError);
            await expect(searchByCEPService.execute('01310-100')).rejects.toThrow('Cidade com código IBGE 3550308 ou seu estado não encontrado no banco de dados');
            expect(mockViaCepApi.getAddressByCEP).toHaveBeenCalledWith('01310-100');
            expect(mockCityRepository.findCityByIBGECode).toHaveBeenCalledWith(3550308);
        });
        it('should throw NotFoundError when city exists but state is missing', async () => {
            mockViaCepApi.getAddressByCEP = jest
                .fn()
                .mockResolvedValue(mockViaCEPData);
            mockCityRepository.findCityByIBGECode = jest.fn().mockResolvedValue({
                id: 3550308,
                name: 'São Paulo',
                stateId: 35,
            });
            await expect(searchByCEPService.execute('01310-100')).rejects.toThrow(errors_1.NotFoundError);
        });
        it('should successfully return address data', async () => {
            mockViaCepApi.getAddressByCEP = jest
                .fn()
                .mockResolvedValue(mockViaCEPData);
            mockCityRepository.findCityByIBGECode = jest
                .fn()
                .mockResolvedValue(mockCityWithState);
            const result = await searchByCEPService.execute('01310-100');
            expect(mockViaCepApi.getAddressByCEP).toHaveBeenCalledWith('01310-100');
            expect(mockCityRepository.findCityByIBGECode).toHaveBeenCalledWith(3550308);
            expect(result.cep).toBe('01310-100');
            expect(result.street).toBe('Avenida Paulista');
            expect(result.complement).toBe('lado ímpar');
            expect(result.neighborhood).toBe('Bela Vista');
            expect(result.city).toEqual({
                id: 3550308,
                name: 'São Paulo',
                stateId: 35,
            });
            expect(result.state).toEqual({
                id: 35,
                name: 'São Paulo',
                uf: 'SP',
            });
        });
        it('should handle different CEP formats', async () => {
            const viaCEPDataWithoutDash = {
                ...mockViaCEPData,
                cep: '01310100',
            };
            mockViaCepApi.getAddressByCEP = jest
                .fn()
                .mockResolvedValue(viaCEPDataWithoutDash);
            mockCityRepository.findCityByIBGECode = jest
                .fn()
                .mockResolvedValue(mockCityWithState);
            const result = await searchByCEPService.execute('01310100');
            expect(mockViaCepApi.getAddressByCEP).toHaveBeenCalledWith('01310100');
            expect(result.cep).toBe('01310100');
        });
    });
});
//# sourceMappingURL=search-by-cep.service.test.js.map