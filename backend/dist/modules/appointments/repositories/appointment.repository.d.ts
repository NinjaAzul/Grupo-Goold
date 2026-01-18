import { RoomModel } from '@modules/rooms/model/room.model';
import { IAppointment, AppointmentStatus } from '../model/appointment.interface';
import { ICreateAppointmentRequest } from '../use-cases/create/create.interface';
import { IListAppointmentsRequest } from '../use-cases/list/list.interface';
import { AdminListAppointmentsQueryDto } from '../use-cases/admin-list/admin-list-query.dto';
import { ICancelAppointmentRequest } from '../use-cases/cancel/cancel.interface';
export declare class AppointmentRepository {
    create(data: ICreateAppointmentRequest): Promise<IAppointment | null>;
    findAll(filters: IListAppointmentsRequest): Promise<{
        rows: IAppointment[];
        count: number;
    }>;
    findAllAdmin(filters: AdminListAppointmentsQueryDto): Promise<{
        appointments: IAppointment[];
        total: number;
    }>;
    getRooms(roomId?: number): Promise<RoomModel[]>;
    updateStatus(appointmentId: number, status: AppointmentStatus): Promise<IAppointment | null>;
    cancel(request: ICancelAppointmentRequest): Promise<IAppointment | null>;
}
//# sourceMappingURL=appointment.repository.d.ts.map