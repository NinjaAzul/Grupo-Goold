import { CityModel } from '../../model/city.model';
import { StateModel } from '@modules/states/model/state.model';
import { ICity } from '../../model/city.interface';
import { QueryBuilder } from '@shared/utils/query-builder';

export class ListCitiesRepository {
  async findAll(stateId?: number, uf?: string): Promise<ICity[]> {
    const queryBuilder = new QueryBuilder();

    if (stateId) {
      queryBuilder.where({ stateId });
    }

    if (uf) {
      queryBuilder.include([
        {
          model: StateModel,
          as: 'state',
          where: { uf },
          required: true,
        },
      ]);
    }

    queryBuilder.order([['name', 'ASC']]);

    const cities = await CityModel.findAll(queryBuilder.build());

    return cities.map((city) => city.toJSON() as ICity);
  }
}
