import { CheckHealthRepository } from './health-check.repository';
import {
  ICheckHealthRequest,
  ICheckHealthResponse,
} from './health-check.interface';
import { IHealthStatus } from '../../health.interface';

export class CheckHealthService {
  private checkHealthRepository: CheckHealthRepository;

  constructor() {
    this.checkHealthRepository = new CheckHealthRepository();
  }

  async execute(_request: ICheckHealthRequest): Promise<ICheckHealthResponse> {
    const healthStatus: IHealthStatus =
      await this.checkHealthRepository.getStatus();

    return {
      health: healthStatus,
    };
  }
}
