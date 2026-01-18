import { RoleModel } from '@modules/roles/model/role.model';
import { IRole } from '@modules/roles/model/role.interface';

export class RoleRepository {
  async findById(roleId: number): Promise<IRole | null> {
    const role = await RoleModel.findByPk(roleId);
    return role ? (role.toJSON() as IRole) : null;
  }
}
