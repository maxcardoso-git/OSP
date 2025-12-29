import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { DataSource } from "typeorm";

@Injectable()
export class OrgContextInterceptor implements NestInterceptor {
  private readonly logger = new Logger(OrgContextInterceptor.name);

  constructor(private dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const orgId = request.orgId || request.user?.orgId;

    if (orgId) {
      try {
        // Set the PostgreSQL session variable for Row Level Security
        await this.dataSource.query(
          `SET app.org_id = $1`,
          [orgId],
        );
        
        this.logger.debug(`Set org context: ${orgId}`);
      } catch (error) {
        this.logger.error(`Failed to set org context: ${error.message}`);
      }
    }

    return next.handle();
  }
}
