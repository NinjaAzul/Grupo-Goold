export interface Log {
  id: string;
  clienteNome: string;
  clienteEmail: string;
  tipoAtividade: string;
  modulo: string;
  dataHorario: string;
}

export type SortField = 'data' | null;
export type SortDirection = 'asc' | 'desc' | null;

// Tipos da API
export interface ApiLog {
  id: number;
  userId?: number | null;
  activityType: string;
  module: string;
  description?: string | null;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt?: string;
}

export interface ApiLogsResponse {
  success: boolean;
  data: ApiLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

