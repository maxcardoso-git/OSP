import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreateOrgUnitTypeDto } from './create-org-unit-type.dto';

export class UpdateOrgUnitTypeDto extends PartialType(CreateOrgUnitTypeDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
