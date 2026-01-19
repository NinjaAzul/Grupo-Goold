import { Request, Response } from 'express';
import { SeedService } from './seed.service';

export class SeedController {
  private seedService: SeedService;

  constructor() {
    this.seedService = new SeedService();
  }

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this.seedService.execute();
      return res.status(200).json({
        success: true,
        message: 'Seeds executed successfully',
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Error executing seeds',
        error: error.message,
      });
    }
  }
}
