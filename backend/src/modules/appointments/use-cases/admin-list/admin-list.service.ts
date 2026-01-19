import { AppointmentRepository } from '../../repositories/appointment.repository';
import {
  IAdminListAppointmentsRequest,
  IAdminListAppointmentsResponse,
} from './admin-list.interface';
import { DateHelper } from '@shared/utils/date.helper';

export class AdminListAppointmentsService {
  private appointmentRepository: AppointmentRepository;

  constructor() {
    this.appointmentRepository = new AppointmentRepository();
  }

  async execute(
    filters: IAdminListAppointmentsRequest
  ): Promise<IAdminListAppointmentsResponse> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const { appointments, total } =
      await this.appointmentRepository.findAllAdmin(
        filters as unknown as Parameters<
          typeof this.appointmentRepository.findAllAdmin
        >[0]
      );

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: DateHelper.normalizeDatesInObject(appointments),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}
