import { IsString, IsOptional, Matches, IsNumber, Min } from 'class-validator';

export class UpdateRoomDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in HH:mm format (e.g., 08:00)',
  })
  startTime?: string;

  @IsString()
  @IsOptional()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'End time must be in HH:mm format (e.g., 18:00)',
  })
  endTime?: string;

  @IsNumber()
  @IsOptional()
  @Min(15, { message: 'Time block must be at least 15 minutes' })
  timeBlock?: number;
}
