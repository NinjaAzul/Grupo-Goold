import { ICity } from '../../model/city.interface';
export interface IListCitiesResponse {
    cities: ICity[];
    total: number;
}
export interface IListCitiesQuery {
    stateId?: number;
    uf?: string;
}
//# sourceMappingURL=list.interface.d.ts.map