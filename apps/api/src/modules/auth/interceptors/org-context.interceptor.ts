import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Observable, tap } from 'rxjs';

@Injectable()
export class OrgContextInterceptor implements NestInterceptor {
  private readonly logger = new Logger(OrgContextInterceptor.name);

  constructor(private dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const orgId = request.orgId;

    if (orgId) {
      try {
        await this.dataSource.query(
          "SELECT set_config('app.org_id', $1, true)",
          [orgId],
        );
        this.logger.debug(`Set org context: ${orgId}`);
      } catch (error: any) {
        this.logger.error(`Failed to set org context: ${error.message}`);
      }
    }

    return next.handle().pipe(
      tap(() => {
        // Context is automatically cleared at end of transaction
      }),
    );
  }
}
