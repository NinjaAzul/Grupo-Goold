export interface Appointment {
  id: string;
  date: string;
  name: string;
  type: string;
  room: string;
  status: 'scheduled' | 'cancelled' | 'pending';
}

export type SortField = 'date' | 'name' | null;
export type SortDirection = 'asc' | 'desc' | null;

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

