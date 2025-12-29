import { IsString, IsOptional, IsArray, IsNumber, MaxLength } from 'class-validator';

export class CreateOrgUnitTypeDto {
  @IsString()
  @MaxLength(50)
  code: string;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  color?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedParentTypes?: string[];

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
