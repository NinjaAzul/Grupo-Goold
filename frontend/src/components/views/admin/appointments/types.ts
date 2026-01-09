export interface Agendamento {
  id: string;
  data: string;
  nome: string;
  tipo: string;
  sala: string;
  status: 'agendado' | 'cancelado' | 'em_analise';
}

export type SortField = 'data' | 'nome' | null;
export type SortDirection = 'asc' | 'desc' | null;

