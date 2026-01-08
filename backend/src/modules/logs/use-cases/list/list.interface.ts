import { ILog } from '@modules/logs/model/log.interface';
import { PaginatedResponse } from '@shared/types';

export interface IListLogsRequest {
  page?: number;
  limit?: number;
  userId?: number;
  activityType?: string;
  module?: string;
  startDate?: string;
  endDate?: string;
}

export interface IListLogsResponse extends PaginatedResponse<ILog> {}
