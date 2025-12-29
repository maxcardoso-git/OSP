import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'required_permission';

/**
 * Decorator to require a specific permission for an endpoint
 * Usage: @RequirePermission('osp.organizations:read')
 */
export const RequirePermission = (...permissions: string[]) => 
  SetMetadata(PERMISSION_KEY, permissions);
