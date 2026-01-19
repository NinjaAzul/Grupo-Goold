import { Model } from 'sequelize';
import { IAppointment, AppointmentStatus } from './appointment.interface';
export declare class AppointmentModel extends Model<IAppointment> implements IAppointment {
    id: number;
    userId: number;
    appointmentDate: Date;
    roomId: number;
    status: AppointmentStatus;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
//# sourceMappingURL=appointment.model.d.ts.map