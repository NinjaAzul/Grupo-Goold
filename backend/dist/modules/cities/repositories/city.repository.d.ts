import { ICity } from '../model/city.interface';
import { IState } from '@modules/states/model/state.interface';
export declare class CityRepository {
    findById(cityId: number): Promise<ICity | null>;
    findByIbgeCode(ibgeCode: number): Promise<ICity | null>;
    findAll(stateId?: number, uf?: string): Promise<ICity[]>;
    findCityByIBGECode(ibgeCode: number): Promise<(ICity & {
        state: IState;
    }) | null>;
}
//# sourceMappingURL=city.repository.d.ts.map