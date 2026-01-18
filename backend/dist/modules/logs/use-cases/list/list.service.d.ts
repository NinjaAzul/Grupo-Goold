import { IListLogsRequest, IListLogsResponse } from './list.interface';
export declare class ListLogsService {
    private logRepository;
    constructor();
    execute(filters: IListLogsRequest): Promise<IListLogsResponse>;
}
//# sourceMappingURL=list.service.d.ts.map