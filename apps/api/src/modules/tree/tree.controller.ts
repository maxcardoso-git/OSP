import { Controller, Get, Param, Query } from '@nestjs/common';
import { TreeService } from './tree.service';
import { OrgContext } from '../auth/decorators/org-context.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Controller('tree')
export class TreeController {
  constructor(private readonly service: TreeService) {}

  @Get()
  @RequirePermission('osp.tree:read')
  getTree(
    @OrgContext() orgId: string,
    @Query('rootId') rootId?: string,
    @Query('maxDepth') maxDepth?: string,
  ) {
    return this.service.getTree(
      orgId,
      rootId,
      maxDepth ? parseInt(maxDepth, 10) : undefined,
    );
  }

  @Get(':nodeId/path')
  @RequirePermission('osp.tree:read')
  getPath(@OrgContext() orgId: string, @Param('nodeId') nodeId: string) {
    return this.service.getPath(orgId, nodeId);
  }
}
