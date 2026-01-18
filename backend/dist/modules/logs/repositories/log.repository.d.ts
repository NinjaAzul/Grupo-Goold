import { ILog } from '../model/log.interface';
import { IListLogsRequest } from '../use-cases/list/list.interface';
export declare class LogRepository {
    /**
     * Lista logs com filtros e paginação
     */
    findAll(filters: IListLogsRequest): Promise<{
        logs: ILog[];
        total: number;
    }>;
}
//# sourceMappingURL=log.repository.d.ts.map