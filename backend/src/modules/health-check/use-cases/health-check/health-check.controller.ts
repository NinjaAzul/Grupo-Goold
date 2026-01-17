import { Request, Response, NextFunction } from 'express';
import { CheckHealthService } from './health-check.service';

export class CheckHealthController {
  private checkHealthService: CheckHealthService;

  constructor() {
    this.checkHealthService = new CheckHealthService();
  }

  handle = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const response = await this.checkHealthService.execute();

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  };
}
