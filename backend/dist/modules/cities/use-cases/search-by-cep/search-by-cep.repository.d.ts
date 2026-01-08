import { ICity } from '../../model/city.interface';
import { IState } from '@modules/states/model/state.interface';
export declare class SearchByCEPRepository {
    findCityByIBGECode(ibgeCode: number): Promise<(ICity & {
        state: IState;
    }) | null>;
}
//# sourceMappingURL=search-by-cep.repository.d.ts.map