import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class AvailableRoomsQueryDto {
  @IsNotEmpty({ message: 'Date is required' })
  @IsString({ message: 'Date must be a string' })
  date!: string;

  @IsNotEmpty({ message: 'Time is required' })
  @IsString({ message: 'Time must be a string' })
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in HH:mm format (e.g., 14:30)',
  })
  time!: string;
}
