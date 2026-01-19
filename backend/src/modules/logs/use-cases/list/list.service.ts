import { LogRepository } from '../../repositories/log.repository';
import { IListLogsRequest, IListLogsResponse } from './list.interface';
import { DateHelper } from '@shared/utils/date.helper';

export class ListLogsService {
  private logRepository: LogRepository;

  constructor() {
    this.logRepository = new LogRepository();
  }

  async execute(filters: IListLogsRequest): Promise<IListLogsResponse> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const { logs, total } = await this.logRepository.findAll(filters);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: DateHelper.normalizeDatesInObject(logs),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}
