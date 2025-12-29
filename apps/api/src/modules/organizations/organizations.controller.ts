import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrgContext } from '../auth/decorators/org-context.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly service: OrganizationsService) {}

  @Post()
  @RequirePermission('osp.organizations:create')
  create(@OrgContext() orgId: string, @Body() dto: CreateOrganizationDto) {
    return this.service.create(orgId, dto);
  }

  @Get()
  @RequirePermission('osp.organizations:read')
  findAll(@OrgContext() orgId: string) {
    return this.service.findAll(orgId);
  }

  @Get(':id')
  @RequirePermission('osp.organizations:read')
  findOne(@OrgContext() orgId: string, @Param('id') id: string) {
    return this.service.findOne(orgId, id);
  }

  @Patch(':id')
  @RequirePermission('osp.organizations:update')
  update(
    @OrgContext() orgId: string,
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationDto,
  ) {
    return this.service.update(orgId, id, dto);
  }

  @Delete(':id')
  @RequirePermission('osp.organizations:delete')
  remove(@OrgContext() orgId: string, @Param('id') id: string) {
    return this.service.remove(orgId, id);
  }
}
