import { ListLogsRepository } from './list.repository';
import { IListLogsRequest, IListLogsResponse } from './list.interface';

export class ListLogsService {
  private repository: ListLogsRepository;

  constructor() {
    this.repository = new ListLogsRepository();
  }

  async execute(filters: IListLogsRequest): Promise<IListLogsResponse> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const { logs, total } = await this.repository.findAll(filters);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}
