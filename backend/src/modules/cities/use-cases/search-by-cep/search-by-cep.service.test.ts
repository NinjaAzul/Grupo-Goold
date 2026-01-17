import { SearchByCEPService } from './search-by-cep.service';
import { SearchByCEPRepository } from './search-by-cep.repository';
import { viaCepApi } from '@shared/integrations';
import { NotFoundError } from '@shared/errors';
import { ICity } from '@modules/cities/model/city.interface';
import { IState } from '@modules/states/model/state.interface';

// Mocks
jest.mock('./search-by-cep.repository');
jest.mock('@shared/integrations');

describe('SearchByCEPService', () => {
  let searchByCEPService: SearchByCEPService;
  let mockSearchByCEPRepository: jest.Mocked<SearchByCEPRepository>;
  const mockViaCepApi = viaCepApi as jest.Mocked<typeof viaCepApi>;

  beforeEach(() => {
    mockSearchByCEPRepository =
      new SearchByCEPRepository() as jest.Mocked<SearchByCEPRepository>;
    searchByCEPService = new SearchByCEPService();
    (
      searchByCEPService as unknown as {
        searchByCEPRepository: SearchByCEPRepository;
      }
    ).searchByCEPRepository = mockSearchByCEPRepository;
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

    const mockCityWithState: ICity & { state: IState } = {
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
      mockSearchByCEPRepository.findCityByIBGECode = jest
        .fn()
        .mockResolvedValue(null);

      await expect(searchByCEPService.execute('01310-100')).rejects.toThrow(
        NotFoundError
      );
      await expect(searchByCEPService.execute('01310-100')).rejects.toThrow(
        'City with IBGE code 3550308 or its state not found in database'
      );

      expect(mockViaCepApi.getAddressByCEP).toHaveBeenCalledWith('01310-100');
      expect(mockSearchByCEPRepository.findCityByIBGECode).toHaveBeenCalledWith(
        3550308
      );
    });

    it('should throw NotFoundError when city exists but state is missing', async () => {
      mockViaCepApi.getAddressByCEP = jest
        .fn()
        .mockResolvedValue(mockViaCEPData);
      mockSearchByCEPRepository.findCityByIBGECode = jest
        .fn()
        .mockResolvedValue({
          id: 3550308,
          name: 'São Paulo',
          stateId: 35,
        } as ICity & { state: IState });

      await expect(searchByCEPService.execute('01310-100')).rejects.toThrow(
        NotFoundError
      );
    });

    it('should successfully return address data', async () => {
      mockViaCepApi.getAddressByCEP = jest
        .fn()
        .mockResolvedValue(mockViaCEPData);
      mockSearchByCEPRepository.findCityByIBGECode = jest
        .fn()
        .mockResolvedValue(mockCityWithState);

      const result = await searchByCEPService.execute('01310-100');

      expect(mockViaCepApi.getAddressByCEP).toHaveBeenCalledWith('01310-100');
      expect(mockSearchByCEPRepository.findCityByIBGECode).toHaveBeenCalledWith(
        3550308
      );
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
      mockSearchByCEPRepository.findCityByIBGECode = jest
        .fn()
        .mockResolvedValue(mockCityWithState);

      const result = await searchByCEPService.execute('01310100');

      expect(mockViaCepApi.getAddressByCEP).toHaveBeenCalledWith('01310100');
      expect(result.cep).toBe('01310100');
    });
  });
});
