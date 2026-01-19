import { Request, Response } from 'express';
import { MigrateService } from './migrate.service';

export class MigrateController {
  private migrateService: MigrateService;

  constructor() {
    this.migrateService = new MigrateService();
  }

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this.migrateService.execute();
      return res.status(200).json({
        success: true,
        message: 'Migrations executed successfully',
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Error executing migrations',
        error: error.message,
      });
    }
  }
}
