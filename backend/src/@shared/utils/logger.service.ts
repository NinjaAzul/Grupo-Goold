import { ILog } from '@/modules/logs/model';
import { LogModel } from '@modules/logs/model/log.model';

export interface ICreateLogParams {
  userId?: number | null;
  activityType: string;
  module: string;
  description?: string | null;
}

export class LoggerService {
  /**
   * Cria um log de atividade
   * @param params Parâmetros do log
   */
  static async createLog(params: ICreateLogParams): Promise<void> {
    try {
      await LogModel.create({
        userId: params.userId ?? null,
        activityType: params.activityType,
        module: params.module,
        description: params.description ?? null,
      } as ILog);
    } catch (error) {
      console.error('Error creating log:', error);
    }
  }

  /**
   * Helper para criar logs de forma mais simples
   */
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
