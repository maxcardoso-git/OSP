import { IsOptional, IsUUID } from 'class-validator';

export class MoveOrgUnitDto {
  @IsOptional()
  @IsUUID()
  newParentId: string | null;
}
