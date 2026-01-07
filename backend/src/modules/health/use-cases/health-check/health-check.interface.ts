import { IHealthStatus } from '../../health.interface';

export interface ICheckHealthRequest {
  // Add request parameters if needed
}

export interface ICheckHealthResponse {
  health: IHealthStatus;
}
