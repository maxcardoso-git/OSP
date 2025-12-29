import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrgUnitTypesService } from './org-unit-types.service';
import { CreateOrgUnitTypeDto } from './dto/create-org-unit-type.dto';
import { UpdateOrgUnitTypeDto } from './dto/update-org-unit-type.dto';
import { OrgContext } from '../auth/decorators/org-context.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Controller('org-unit-types')
export class OrgUnitTypesController {
  constructor(private readonly service: OrgUnitTypesService) {}

  @Post()
  @RequirePermission('osp.orgUnitTypes:create')
  create(@OrgContext() orgId: string, @Body() dto: CreateOrgUnitTypeDto) {
    return this.service.create(orgId, dto);
  }

  @Get()
  @RequirePermission('osp.orgUnitTypes:read')
  findAll(@OrgContext() orgId: string) {
    return this.service.findAll(orgId);
  }

  @Get(':id')
  @RequirePermission('osp.orgUnitTypes:read')
  findOne(@OrgContext() orgId: string, @Param('id') id: string) {
    return this.service.findOne(orgId, id);
  }

  @Patch(':id')
  @RequirePermission('osp.orgUnitTypes:update')
  update(
    @OrgContext() orgId: string,
    @Param('id') id: string,
    @Body() dto: UpdateOrgUnitTypeDto,
  ) {
    return this.service.update(orgId, id, dto);
  }

  @Delete(':id')
  @RequirePermission('osp.orgUnitTypes:delete')
  remove(@OrgContext() orgId: string, @Param('id') id: string) {
    return this.service.remove(orgId, id);
  }
}
