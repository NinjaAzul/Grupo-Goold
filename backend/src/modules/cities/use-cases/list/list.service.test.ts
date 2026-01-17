import { ListCitiesService } from './list.service';
import { ListCitiesRepository } from './list.repository';
import { ICity } from '@modules/cities/model/city.interface';

// Mocks
jest.mock('./list.repository');

describe('ListCitiesService', () => {
  let listCitiesService: ListCitiesService;
  let mockListCitiesRepository: jest.Mocked<ListCitiesRepository>;

  beforeEach(() => {
    mockListCitiesRepository =
      new ListCitiesRepository() as jest.Mocked<ListCitiesRepository>;
    listCitiesService = new ListCitiesService();
    (
      listCitiesService as unknown as {
        listCitiesRepository: ListCitiesRepository;
      }
    ).listCitiesRepository = mockListCitiesRepository;
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
      mockListCitiesRepository.findAll = jest
        .fn()
        .mockResolvedValue(mockCities as ICity[]);

      const result = await listCitiesService.execute({});

      expect(mockListCitiesRepository.findAll).toHaveBeenCalledWith(
        undefined,
        undefined
      );
      expect(result.cities).toEqual(mockCities);
      expect(result.total).toBe(2);
    });

    it('should filter cities by stateId', async () => {
      mockListCitiesRepository.findAll = jest
        .fn()
        .mockResolvedValue([mockCities[0]] as ICity[]);

      const result = await listCitiesService.execute({ stateId: 35 });

      expect(mockListCitiesRepository.findAll).toHaveBeenCalledWith(
        35,
        undefined
      );
      expect(result.cities).toEqual([mockCities[0]]);
      expect(result.total).toBe(1);
    });

    it('should filter cities by uf', async () => {
      mockListCitiesRepository.findAll = jest
        .fn()
        .mockResolvedValue([mockCities[0]] as ICity[]);

      const result = await listCitiesService.execute({ uf: 'SP' });

      expect(mockListCitiesRepository.findAll).toHaveBeenCalledWith(
        undefined,
        'SP'
      );
      expect(result.cities).toEqual([mockCities[0]]);
      expect(result.total).toBe(1);
    });

    it('should filter cities by both stateId and uf', async () => {
      mockListCitiesRepository.findAll = jest
        .fn()
        .mockResolvedValue([mockCities[0]] as ICity[]);

      const result = await listCitiesService.execute({ stateId: 35, uf: 'SP' });

      expect(mockListCitiesRepository.findAll).toHaveBeenCalledWith(35, 'SP');
      expect(result.cities).toEqual([mockCities[0]]);
    });

    it('should handle empty results', async () => {
      mockListCitiesRepository.findAll = jest.fn().mockResolvedValue([]);

      const result = await listCitiesService.execute({});

      expect(result.cities).toEqual([]);
      expect(result.total).toBe(0);
    });
  });
});
