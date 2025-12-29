import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrgUnitsService } from './services/org-units.service';
import { CreateOrgUnitDto } from './dto/create-org-unit.dto';
import { UpdateOrgUnitDto } from './dto/update-org-unit.dto';
import { MoveOrgUnitDto } from './dto/move-org-unit.dto';
import { OrgContext } from '../auth/decorators/org-context.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Controller('org-units')
export class OrgUnitsController {
  constructor(private readonly service: OrgUnitsService) {}

  @Post()
  @RequirePermission('osp.orgUnits:create')
  create(@OrgContext() orgId: string, @Body() dto: CreateOrgUnitDto) {
    return this.service.create(orgId, dto);
  }

  @Get()
  @RequirePermission('osp.orgUnits:read')
  findAll(@OrgContext() orgId: string) {
    return this.service.findAll(orgId);
  }

  @Get('children')
  @RequirePermission('osp.orgUnits:read')
  getChildren(@OrgContext() orgId: string, @Query('parentId') parentId?: string) {
    return this.service.getChildren(orgId, parentId || null);
  }

  @Get(':id')
  @RequirePermission('osp.orgUnits:read')
  findOne(@OrgContext() orgId: string, @Param('id') id: string) {
    return this.service.findOne(orgId, id);
  }

  @Patch(':id')
  @RequirePermission('osp.orgUnits:update')
  update(
    @OrgContext() orgId: string,
    @Param('id') id: string,
    @Body() dto: UpdateOrgUnitDto,
  ) {
    return this.service.update(orgId, id, dto);
  }

  @Patch(':id/move')
  @RequirePermission('osp.orgUnits:update')
  move(
    @OrgContext() orgId: string,
    @Param('id') id: string,
    @Body() dto: MoveOrgUnitDto,
  ) {
    return this.service.move(orgId, id, dto);
  }

  @Delete(':id')
  @RequirePermission('osp.orgUnits:delete')
  remove(@OrgContext() orgId: string, @Param('id') id: string) {
    return this.service.remove(orgId, id);
  }
}
