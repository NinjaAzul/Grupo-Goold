import { IUpdateUserPermissionRequest } from '@modules/users/use-cases/update-permission/update-permission.interface';
export declare class UserPermissionRepository {
    findUserById(userId: number): Promise<{
        id: number;
    } | null>;
    findPermissionById(permissionId: number): Promise<{
        id: number;
    } | null>;
    update(data: IUpdateUserPermissionRequest): Promise<void>;
}
//# sourceMappingURL=user-permission.repository.d.ts.map