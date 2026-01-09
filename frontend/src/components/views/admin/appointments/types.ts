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

export interface Room {
  id: number;
  name: string;
  startTime: string; // Formato HH:mm (ex: "08:00")
  endTime: string; // Formato HH:mm (ex: "18:00")
  timeBlock: number; // Bloco de horários em minutos (ex: 30)
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export interface RoomFormData {
  name: string;
  startTime: string;
  endTime: string;
  timeBlock: number;
}

