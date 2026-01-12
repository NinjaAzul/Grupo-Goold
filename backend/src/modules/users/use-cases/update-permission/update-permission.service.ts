import { UpdateUserPermissionRepository } from './update-permission.repository';
import {
  IUpdateUserPermissionRequest,
  IUpdateUserPermissionResponse,
} from './update-permission.interface';

export class UpdateUserPermissionService {
  private repository: UpdateUserPermissionRepository;

  constructor() {
    this.repository = new UpdateUserPermissionRepository();
  }

  async execute(
    data: IUpdateUserPermissionRequest
  ): Promise<IUpdateUserPermissionResponse> {
    await this.repository.update(data);

    return {
      success: true,
      message: 'User permission updated successfully',
    };
  }
}
