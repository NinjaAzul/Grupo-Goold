import { IListUsersResponse } from './list.interface';
import { ListUsersQueryDto } from './list-query.dto';
export declare class ListUsersService {
    private repository;
    constructor();
    execute(filters: ListUsersQueryDto): Promise<IListUsersResponse>;
}
//# sourceMappingURL=list.service.d.ts.map