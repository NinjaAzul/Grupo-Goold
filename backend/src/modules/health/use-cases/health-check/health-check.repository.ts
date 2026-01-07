import { sequelize } from '../../../../@shared';
import { IHealthStatus } from '../../health.interface';

export class CheckHealthRepository {
  async checkDatabase(): Promise<boolean> {
    try {
      await sequelize.authenticate();
      return true;
    } catch (error) {
      return false;
    }
  }

  async getStatus(): Promise<IHealthStatus> {
    const dbStatus = await this.checkDatabase();

    return {
      status: dbStatus ? 'ok' : 'error',
      message: dbStatus
        ? 'All systems operational'
        : 'Database connection failed',
      timestamp: new Date().toISOString(),
    };
  }
}
