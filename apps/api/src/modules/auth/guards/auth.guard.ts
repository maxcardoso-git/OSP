import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { firstValueFrom } from "rxjs";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { User } from "../entities/user.entity";
import { UserSession } from "../entities/user-session.entity";

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
    private httpService: HttpService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserSession)
    private sessionRepository: Repository<UserSession>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const sessionCookieName = this.configService.get<string>("tah.sessionCookieName");
    const sessionToken = request.cookies?.[sessionCookieName];

    if (\!sessionToken) {
      throw new UnauthorizedException("No session token provided");
    }

    try {
      // Validate session with TAH
      const tahBaseUrl = this.configService.get<string>("tah.baseUrl");
      const appId = this.configService.get<string>("tah.appId");

      const response = await firstValueFrom(
        this.httpService.post(
          `${tahBaseUrl}/api/sessions/validate`,
          { sessionToken, appId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      );

      if (\!response.data?.valid) {
        throw new UnauthorizedException("Invalid session");
      }

      const { userId, orgId, permissions } = response.data;

      // Find or sync user
      let user = await this.userRepository.findOne({
        where: { tahUserId: userId, orgId },
      });

      if (\!user) {
        // Fetch user details from TAH and create local user
        const userResponse = await firstValueFrom(
          this.httpService.get(`${tahBaseUrl}/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
          }),
        );

        user = this.userRepository.create({
          tahUserId: userId,
          orgId,
          email: userResponse.data.email,
          name: userResponse.data.name,
          avatarUrl: userResponse.data.avatarUrl,
          isActive: true,
          lastLoginAt: new Date(),
        });

        await this.userRepository.save(user);
      } else {
        // Update last login
        user.lastLoginAt = new Date();
        await this.userRepository.save(user);
      }

      // Attach user info to request
      request.user = {
        id: user.id,
        tahUserId: userId,
        orgId,
        email: user.email,
        name: user.name,
        permissions: permissions || [],
      };
      request.orgId = orgId;

      return true;
    } catch (error) {
      this.logger.error(`Auth validation failed: ${error.message}`);
      throw new UnauthorizedException("Authentication failed");
    }
  }
}
