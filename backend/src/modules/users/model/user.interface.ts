import { IRole } from '@modules/roles';

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  password: string;
  roleId: number;
  zipCode?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  role?: IRole;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
