import { ListAppointmentsRepository } from './list.repository';
import {
  IListAppointmentsRequest,
  IListAppointmentsResponse,
} from './list.interface';

export class ListAppointmentsService {
  private repository: ListAppointmentsRepository;

  constructor() {
    this.repository = new ListAppointmentsRepository();
  }

  async execute(
    request: IListAppointmentsRequest
  ): Promise<IListAppointmentsResponse> {
    const { rows, count } = await this.repository.list(request);

    const page = request.page || 1;
    const limit = request.limit || 10;
    const totalPages = Math.ceil(count / limit);

    return {
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
      },
    };
  }
}
