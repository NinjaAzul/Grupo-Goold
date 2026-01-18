import { CityRepository } from '../../repositories/city.repository';
import { IListCitiesResponse, IListCitiesQuery } from './list.interface';

export class ListCitiesService {
  private cityRepository: CityRepository;

  constructor() {
    this.cityRepository = new CityRepository();
  }

  async execute(query: IListCitiesQuery): Promise<IListCitiesResponse> {
    const cities = await this.cityRepository.findAll(
      query.stateId,
      query.uf
    );

    return {
      cities,
      total: cities.length,
    };
  }
}
