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
    filters: IListAppointmentsRequest
  ): Promise<IListAppointmentsResponse> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const { appointments, total } = await this.repository.findAll(filters);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}
