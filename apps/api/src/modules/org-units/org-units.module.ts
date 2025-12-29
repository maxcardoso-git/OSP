import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrgUnit } from './entities/org-unit.entity';
import { OrgUnitClosure } from './entities/org-unit-closure.entity';
import { OrgUnitsController } from './org-units.controller';
import { OrgUnitsService } from './services/org-units.service';
import { ClosureTableService } from './services/closure-table.service';
import { OrgUnitTypesModule } from '../org-unit-types/org-unit-types.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrgUnit, OrgUnitClosure]),
    OrgUnitTypesModule,
  ],
  controllers: [OrgUnitsController],
  providers: [OrgUnitsService, ClosureTableService],
  exports: [OrgUnitsService, ClosureTableService],
})
export class OrgUnitsModule {}
