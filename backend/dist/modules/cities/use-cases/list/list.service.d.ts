import { IListCitiesResponse, IListCitiesQuery } from './list.interface';
export declare class ListCitiesService {
    private listCitiesRepository;
    constructor();
    execute(query: IListCitiesQuery): Promise<IListCitiesResponse>;
}
//# sourceMappingURL=list.service.d.ts.map