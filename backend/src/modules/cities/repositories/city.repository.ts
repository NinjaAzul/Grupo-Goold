import { CityModel } from '../model/city.model';
import { StateModel } from '@modules/states/model/state.model';
import { ICity } from '../model/city.interface';
import { IState } from '@modules/states/model/state.interface';
import { QueryBuilder } from '@shared/utils/query-builder';

export class CityRepository {
  async findById(cityId: number): Promise<ICity | null> {
    const city = await CityModel.findByPk(cityId);
    return city ? (city.toJSON() as ICity) : null;
  }

  async findByIbgeCode(ibgeCode: number): Promise<ICity | null> {
    const city = await CityModel.findOne({
      where: { id: ibgeCode },
    });
    return city ? (city.toJSON() as ICity) : null;
  }

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

  async findCityByIBGECode(
    ibgeCode: number
  ): Promise<(ICity & { state: IState }) | null> {
    const city = await CityModel.findByPk(ibgeCode, {
      include: [
        {
          model: StateModel,
          as: 'state',
        },
      ],
    });

    if (!city) {
      return null;
    }

    return city.toJSON() as ICity & { state: IState };
  }
}
