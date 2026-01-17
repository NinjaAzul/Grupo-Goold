import { ILog } from '@/modules/logs/model';
import { LogModel } from '@modules/logs/model/log.model';
import { logger } from './logger';

export interface ICreateLogParams {
  userId?: number | null;
  activityType: string;
  module: string;
  description?: string | null;
}

export class LoggerService {
  static async createLog(params: ICreateLogParams): Promise<void> {
    try {
      await LogModel.create({
        userId: params.userId ?? null,
        activityType: params.activityType,
        module: params.module,
        description: params.description ?? null,
      } as ILog);
    } catch (error) {
      logger.error('Error creating log:', error);
    }
  }

  static async log(
    activityType: string,
    module: string,
    userId?: number | null,
    description?: string | null
  ): Promise<void> {
    await this.createLog({
      userId,
      activityType,
      module,
      description,
    });
  }
}
