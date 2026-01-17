import { AdminListAppointmentsRepository } from './admin-list.repository';
import {
  IAdminListAppointmentsRequest,
  IAdminListAppointmentsResponse,
} from './admin-list.interface';

export class AdminListAppointmentsService {
  private repository: AdminListAppointmentsRepository;

  constructor() {
    this.repository = new AdminListAppointmentsRepository();
  }

  async execute(
    filters: IAdminListAppointmentsRequest
  ): Promise<IAdminListAppointmentsResponse> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const { appointments, total } = await this.repository.findAll(
      filters as unknown as Parameters<typeof this.repository.findAll>[0]
    );

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
