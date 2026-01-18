import { AppointmentRepository } from '../../repositories/appointment.repository';
import {
  IListAppointmentsRequest,
  IListAppointmentsResponse,
} from './list.interface';

export class ListAppointmentsService {
  private appointmentRepository: AppointmentRepository;

  constructor() {
    this.appointmentRepository = new AppointmentRepository();
  }

  async execute(
    request: IListAppointmentsRequest
  ): Promise<IListAppointmentsResponse> {
    const { rows, count } = await this.appointmentRepository.findAll(request);

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
