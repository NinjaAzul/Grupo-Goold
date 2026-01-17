import { IsOptional, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListCitiesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'State ID must be a number' })
  @Min(1, { message: 'State ID must be greater than 0' })
  stateId?: number;

  @IsOptional()
  @IsString({ message: 'UF must be a string' })
  uf?: string;
}
