import { IUser } from '../model/user.interface';
import { CreateUserDto } from '../use-cases/create/create.dto';
import { IListUsersRequest } from '../use-cases/list/list.interface';
import { IUpdateUserRequest } from '../use-cases/update/update.interface';
export interface CreateUserRepositoryData extends Omit<CreateUserDto, 'password'> {
    password: string;
}
export interface UpdateUserRepositoryData extends IUpdateUserRequest {
    password?: string;
}
export interface FindUserOptions {
    includeRole?: boolean;
    includeCity?: boolean;
    includePermissions?: boolean;
    excludePassword?: boolean;
}
export declare class UserRepository {
    private formatPermissions;
    create(data: CreateUserRepositoryData): Promise<IUser | null>;
    findAll(filters: IListUsersRequest): Promise<{
        users: IUser[];
        total: number;
    }>;
    findById(userId: number, options?: FindUserOptions): Promise<IUser | null>;
    findByEmail(email: string, options?: FindUserOptions): Promise<IUser | null>;
    emailExists(email: string): Promise<boolean>;
    update(data: UpdateUserRepositoryData): Promise<IUser | null>;
    delete(userId: number): Promise<boolean>;
}
//# sourceMappingURL=user.repository.d.ts.map