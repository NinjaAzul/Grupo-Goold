export interface Agendamento {
  id: string;
  data: string;
  nome: string;
  tipo: string;
  sala: string;
  status: 'agendado' | 'cancelado' | 'em_analise';
}

export type SortField = 'data' | null;
export type SortDirection = 'asc' | 'desc' | null;

// Tipos da API
export interface ApiAppointment {
  id: number;
  userId: number;
  appointmentDate: string;
  room: string;
  status: 'pending' | 'scheduled' | 'cancelled';
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiAppointmentsResponse {
  success: boolean;
  data: ApiAppointment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Room {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  timeBlock: number;
}

