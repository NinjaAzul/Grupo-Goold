import { ICity } from '../../model/city.interface';
import { IState } from '@modules/states/model/state.interface';
export interface ISearchByCEPResponse {
    cep: string;
    street: string;
    complement: string;
    neighborhood: string;
    city: ICity;
    state: IState;
}
//# sourceMappingURL=search-by-cep.interface.d.ts.map