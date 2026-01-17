import { IUser } from '@modules/users/model/user.interface';
import { IListUsersRequest } from './list.interface';
export declare class ListUsersRepository {
    findAll(filters: IListUsersRequest): Promise<{
        users: IUser[];
        total: number;
    }>;
}
//# sourceMappingURL=list.repository.d.ts.map