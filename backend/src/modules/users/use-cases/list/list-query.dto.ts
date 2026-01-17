import {
  IsOptional,
  IsNumber,
  IsString,
  Min,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class ListUsersQueryDto {
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
  @IsString({ message: 'Email must be a string' })
  email?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Role ID must be a number' })
  @Min(1, { message: 'Role ID must be greater than 0' })
  roleId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'City ID must be a number' })
  @Min(1, { message: 'City ID must be greater than 0' })
  cityId?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
  @IsBoolean({ message: 'Active must be a boolean' })
  active?: boolean;

  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid date string' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid date string' })
  endDate?: string;
}
