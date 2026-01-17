import { CityModel } from '@modules/cities/model/city.model';
import { ICity } from '@modules/cities/model/city.interface';

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
}
