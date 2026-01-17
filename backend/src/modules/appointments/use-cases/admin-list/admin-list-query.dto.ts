import {
  IsOptional,
  IsNumber,
  IsString,
  Min,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentStatus } from '@modules/appointments/model/appointment.interface';

export class AdminListAppointmentsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be greater than 0' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be greater than 0' })
  limit?: number;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Room must be a string' })
  room?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus, {
    message: 'Status must be one of: pending, scheduled, cancelled',
  })
  status?: AppointmentStatus;

  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid date string' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid date string' })
  endDate?: string;
}
