import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrgUnitType } from './entities/org-unit-type.entity';
import { OrgUnitTypesController } from './org-unit-types.controller';
import { OrgUnitTypesService } from './org-unit-types.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrgUnitType])],
  controllers: [OrgUnitTypesController],
  providers: [OrgUnitTypesService],
  exports: [OrgUnitTypesService],
})
export class OrgUnitTypesModule {}
