import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreateOrgUnitDto } from './create-org-unit.dto';

export class UpdateOrgUnitDto extends PartialType(CreateOrgUnitDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
