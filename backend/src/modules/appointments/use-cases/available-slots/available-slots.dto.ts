import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AvailableSlotsQueryDto {
  @IsNotEmpty({ message: 'Date is required' })
  @IsString({ message: 'Date must be a string' })
  date!: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'roomId must be a number' })
  @Min(1, { message: 'roomId must be greater than 0' })
  roomId?: number;
}
