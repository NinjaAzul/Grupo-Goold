import { UserPermissionRepository } from '@modules/user-permissions/repositories/user-permission.repository';
import {
  IUpdateUserPermissionRequest,
  IUpdateUserPermissionResponse,
} from './update-permission.interface';
import { NotFoundError } from '@shared/errors';

export class UpdateUserPermissionService {
  private userPermissionRepository: UserPermissionRepository;

  constructor() {
    this.userPermissionRepository = new UserPermissionRepository();
  }

  async execute(
    data: IUpdateUserPermissionRequest
  ): Promise<IUpdateUserPermissionResponse> {
    const user = await this.userPermissionRepository.findUserById(data.userId);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const permission = await this.userPermissionRepository.findPermissionById(
      data.permissionId
    );
    if (!permission) {
      throw new NotFoundError('Permissão não encontrada');
    }

    await this.userPermissionRepository.update(data);

    return {
      success: true,
      message: 'User permission updated successfully',
    };
  }
}
