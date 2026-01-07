import { Request, Response } from 'express';
import { CheckHealthService } from './health-check.service';
import { ICheckHealthRequest } from './health-check.interface';

export class CheckHealthController {
  private checkHealthService: CheckHealthService;

  constructor() {
    this.checkHealthService = new CheckHealthService();
  }

  handle = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const request: ICheckHealthRequest = {};
      const response = await this.checkHealthService.execute(request);

      return res.status(200).json(response.health);
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    }
  };
}
