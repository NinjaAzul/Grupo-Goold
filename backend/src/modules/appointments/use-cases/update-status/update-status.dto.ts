import { IsEnum, IsNotEmpty } from 'class-validator';
import { AppointmentStatus } from '@modules/appointments/model/appointment.interface';

export class UpdateStatusDto {
  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(AppointmentStatus, {
    message: 'Status must be one of: pending, scheduled, cancelled',
  })
  status!: AppointmentStatus;
}
