import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const OrgContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    
    // Get orgId from request (set by auth guard or header)
    const orgId = request.orgId || 
                  request.headers["x-org-id"] || 
                  request.user?.orgId ||
                  null;

    return orgId;
  },
);
