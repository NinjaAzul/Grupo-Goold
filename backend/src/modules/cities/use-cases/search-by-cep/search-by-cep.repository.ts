import { CityModel } from '../../model/city.model';
import { StateModel } from '@modules/states/model/state.model';
import { ICity } from '../../model/city.interface';
import { IState } from '@modules/states/model/state.interface';

export class SearchByCEPRepository {
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
