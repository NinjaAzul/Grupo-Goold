import { ILog } from '../model/log.interface';
import { IListLogsRequest } from '../use-cases/list/list.interface';
export declare class LogRepository {
    findAll(filters: IListLogsRequest): Promise<{
        logs: ILog[];
        total: number;
    }>;
}
//# sourceMappingURL=log.repository.d.ts.map