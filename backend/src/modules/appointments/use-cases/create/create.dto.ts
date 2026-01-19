import { IsDateString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @IsDateString()
  @IsNotEmpty()
  appointmentDate!: string;

  @IsNotEmpty({ message: 'Room ID is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Room ID must be a number' })
  @Min(1, { message: 'Room ID must be greater than 0' })
  roomId!: number;
}
