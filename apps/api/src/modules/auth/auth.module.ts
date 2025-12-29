import { Module, Global } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from './guards/auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { OrgContextInterceptor } from './interceptors/org-context.interceptor';
import { TahTokenValidatorService } from './services/tah-token-validator.service';
import { SessionService } from './services/session.service';
import { User } from './entities/user.entity';
import { UserSession } from './entities/user-session.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSession]),
    HttpModule,
  ],
  providers: [
    TahTokenValidatorService,
    SessionService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: OrgContextInterceptor,
    },
  ],
  exports: [TypeOrmModule, TahTokenValidatorService, SessionService],
})
export class AuthModule {}
