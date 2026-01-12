import { IsBoolean } from 'class-validator';

export class UpdateUserPermissionDto {
  @IsBoolean()
  granted!: boolean;
}
