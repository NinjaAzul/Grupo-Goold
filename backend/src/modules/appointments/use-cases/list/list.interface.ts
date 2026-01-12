import { IAppointment } from '@modules/appointments/model/appointment.interface';
import { PaginatedResponse } from '@shared/types/pagination.interface';

export interface IListAppointmentsRequest {
  userId: number;
  page?: number;
  limit?: number;
  name?: string; // Busca por nome, CPF, CNPJ ou email do próprio usuário
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface IListAppointmentsResponse
  extends PaginatedResponse<IAppointment> {}

