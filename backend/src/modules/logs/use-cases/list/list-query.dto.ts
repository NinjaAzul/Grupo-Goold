import {
  IsOptional,
  IsNumber,
  IsString,
  Min,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ListLogsQueryDto {
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
  @Type(() => Number)
  @IsNumber({}, { message: 'User ID must be a number' })
  @Min(1, { message: 'User ID must be greater than 0' })
  userId?: number;

  @IsOptional()
  @IsString({ message: 'Activity type must be a string' })
  activityType?: string;

  @IsOptional()
  @IsString({ message: 'Module must be a string' })
  module?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid date string' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid date string' })
  endDate?: string;
}
