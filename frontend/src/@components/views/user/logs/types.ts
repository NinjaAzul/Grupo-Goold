export interface Log {
  id: string;
  activityType: string;
  module: string;
  dateTime: string;
}

export type SortField = 'date' | null;
export type SortDirection = 'asc' | 'desc' | null;
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

