import { ICheckHealthResponse } from './health-check.interface';

export class CheckHealthService {
  constructor() {}

  async execute(): Promise<ICheckHealthResponse> {
    return {
      health: 'ok',
    };
  }
}
