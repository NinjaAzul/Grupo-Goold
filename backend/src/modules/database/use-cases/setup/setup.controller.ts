import { Request, Response } from 'express';
import { MigrateService } from '../migrate/migrate.service';
import { SeedService } from '../seed/seed.service';

export class SetupController {
  private migrateService: MigrateService;
  private seedService: SeedService;

  constructor() {
    this.migrateService = new MigrateService();
    this.seedService = new SeedService();
  }

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { action } = req.query;

      if (action === 'migrate') {
        const result = await this.migrateService.execute();
        return res.status(200).json({
          success: true,
          message: 'Migrations executed successfully',
          data: result,
        });
      }

      if (action === 'seed') {
        const result = await this.seedService.execute();
        return res.status(200).json({
          success: true,
          message: 'Seeds executed successfully',
          data: result,
        });
      }

      if (action === 'all') {
        const migrateResult = await this.migrateService.execute();
        const seedResult = await this.seedService.execute();
        return res.status(200).json({
          success: true,
          message: 'Migrations and seeds executed successfully',
          data: {
            migrations: migrateResult,
            seeds: seedResult,
          },
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use ?action=migrate, ?action=seed, or ?action=all',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Error executing setup',
        error: error.message,
        stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
      });
    }
  }
}
