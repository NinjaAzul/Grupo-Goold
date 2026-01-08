import { ListCitiesRepository } from './list.repository';
import { IListCitiesResponse, IListCitiesQuery } from './list.interface';

export class ListCitiesService {
  private listCitiesRepository: ListCitiesRepository;

  constructor() {
    this.listCitiesRepository = new ListCitiesRepository();
  }

  async execute(query: IListCitiesQuery): Promise<IListCitiesResponse> {
    const cities = await this.listCitiesRepository.findAll(
      query.stateId,
      query.uf
    );

    return {
      cities,
      total: cities.length,
    };
  }
}
