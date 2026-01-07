import { Request, Response } from 'express';
import { CheckHealthService } from './health-check.service';

export class CheckHealthController {
  private checkHealthService: CheckHealthService;

  constructor() {
    this.checkHealthService = new CheckHealthService();
  }

  handle = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const response = await this.checkHealthService.execute();

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    }
  };
}
