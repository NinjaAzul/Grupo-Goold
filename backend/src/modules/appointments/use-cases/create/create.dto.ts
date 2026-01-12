import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsDateString()
  @IsNotEmpty()
  appointmentDate!: string;

  @IsString()
  @IsNotEmpty()
  room!: string;
}
