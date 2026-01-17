import { ILog } from '@modules/logs/model/log.interface';
import { IListLogsRequest } from './list.interface';
export declare class ListLogsRepository {
    findAll(filters: IListLogsRequest): Promise<{
        logs: ILog[];
        total: number;
    }>;
}
//# sourceMappingURL=list.repository.d.ts.map