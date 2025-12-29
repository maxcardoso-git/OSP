import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreeController } from './tree.controller';
import { TreeService } from './tree.service';
import { OrgUnit } from '../org-units/entities/org-unit.entity';
import { OrgUnitClosure } from '../org-units/entities/org-unit-closure.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrgUnit, OrgUnitClosure])],
  controllers: [TreeController],
  providers: [TreeService],
  exports: [TreeService],
})
export class TreeModule {}
