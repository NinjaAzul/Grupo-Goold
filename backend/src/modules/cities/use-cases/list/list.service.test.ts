import { ListCitiesService } from './list.service';
import { CityRepository } from '../../repositories/city.repository';
import { ICity } from '@modules/cities/model/city.interface';

// Mocks
jest.mock('../../repositories/city.repository');

describe('ListCitiesService', () => {
  let listCitiesService: ListCitiesService;
  let mockCityRepository: jest.Mocked<CityRepository>;

  beforeEach(() => {
    mockCityRepository = new CityRepository() as jest.Mocked<CityRepository>;
    listCitiesService = new ListCitiesService();
    (
      listCitiesService as unknown as {
        cityRepository: CityRepository;
      }
    ).cityRepository = mockCityRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const mockCities: Partial<ICity>[] = [
      {
        id: 3550308,
        name: 'São Paulo',
        stateId: 35,
      },
      {
        id: 3304557,
        name: 'Rio de Janeiro',
        stateId: 33,
      },
    ];

    it('should return all cities without filters', async () => {
      mockCityRepository.findAll = jest
        .fn()
        .mockResolvedValue(mockCities as ICity[]);

      const result = await listCitiesService.execute({});

      expect(mockCityRepository.findAll).toHaveBeenCalledWith(
        undefined,
        undefined
      );
      expect(result.cities).toEqual(mockCities);
      expect(result.total).toBe(2);
    });

    it('should filter cities by stateId', async () => {
      mockCityRepository.findAll = jest
        .fn()
        .mockResolvedValue([mockCities[0]] as ICity[]);

      const result = await listCitiesService.execute({ stateId: 35 });

      expect(mockCityRepository.findAll).toHaveBeenCalledWith(35, undefined);
      expect(result.cities).toEqual([mockCities[0]]);
      expect(result.total).toBe(1);
    });

    it('should filter cities by uf', async () => {
      mockCityRepository.findAll = jest
        .fn()
        .mockResolvedValue([mockCities[0]] as ICity[]);

      const result = await listCitiesService.execute({ uf: 'SP' });

      expect(mockCityRepository.findAll).toHaveBeenCalledWith(undefined, 'SP');
      expect(result.cities).toEqual([mockCities[0]]);
      expect(result.total).toBe(1);
    });

    it('should filter cities by both stateId and uf', async () => {
      mockCityRepository.findAll = jest
        .fn()
        .mockResolvedValue([mockCities[0]] as ICity[]);

      const result = await listCitiesService.execute({ stateId: 35, uf: 'SP' });

      expect(mockCityRepository.findAll).toHaveBeenCalledWith(35, 'SP');
      expect(result.cities).toEqual([mockCities[0]]);
    });

    it('should handle empty results', async () => {
      mockCityRepository.findAll = jest.fn().mockResolvedValue([]);

      const result = await listCitiesService.execute({});

      expect(result.cities).toEqual([]);
      expect(result.total).toBe(0);
    });
  });
});
