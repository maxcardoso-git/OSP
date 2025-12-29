import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { OrgContext } from '../auth/decorators/org-context.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @RequirePermission('osp.audit:read')
  async findAll(
    @OrgContext() orgId: string,
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('action') action?: string,
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditService.findAll({
      orgId,
      entityType,
      entityId,
      action: action as any,
      userId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 50,
    });
  }
}
