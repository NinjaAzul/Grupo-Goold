export interface Client {
  id: string;
  registrationDate: string;
  name: string;
  email: string;
  address: string;
  permissions: Permission[];
  status: boolean;
}

export interface Permission {
  id: number;
  name: string;
  granted: boolean;
}

export type SortField = 'registrationDate' | null;
export type SortDirection = 'asc' | 'desc' | null;

export interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  zipCode?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  cityId?: number | null;
  role?: {
    id: number;
    name: string;
  };
  city?: {
    id: number;
    name: string;
    state?: {
      id: number;
      name: string;
      uf: string;
    };
  };
  active?: boolean;
  permissions?: Array<{
    permission: {
      id: number;
      name: string;
    };
    granted: boolean;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiUsersResponse {
  success: boolean;
  data: ApiUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

