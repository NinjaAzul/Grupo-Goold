import { IAppointment } from '@modules/appointments/model/appointment.interface';
import { PaginatedResponse } from '@shared/types';

export interface IAdminListAppointmentsRequest {
  page?: number;
  limit?: number;
  name?: string;
  room?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface IAdminListAppointmentsResponse extends PaginatedResponse<IAppointment> {}
