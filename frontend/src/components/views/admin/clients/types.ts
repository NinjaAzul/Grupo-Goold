export interface Cliente {
  id: string;
  dataCadastro: string;
  nome: string;
  email: string;
  endereco: string;
  permissoes: Permissao[];
  status: boolean;
}

export interface Permissao {
  id: number;
  name: string;
  granted: boolean;
}

export type SortField = 'dataCadastro' | null;
export type SortDirection = 'asc' | 'desc' | null;

// Tipos da API
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

