import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

export interface TahTokenPayload {
  sub: string;
  org_id: string;
  email: string;
  name?: string;
  permissions?: string[];
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

@Injectable()
export class TahTokenValidatorService {
  private readonly logger = new Logger(TahTokenValidatorService.name);
  private readonly client: jwksClient.JwksClient;
  private readonly issuer: string;
  private readonly audience: string;

  constructor(private configService: ConfigService) {
    const publicKeyUrl = this.configService.get<string>('tah.publicKeyUrl');
    this.issuer = this.configService.get<string>('tah.issuer') || '';
    this.audience = this.configService.get<string>('tah.audience') || '';

    this.client = jwksClient({
      jwksUri: publicKeyUrl || '',
      cache: true,
      cacheMaxAge: 86400000, // 24 hours
      rateLimit: true,
      jwksRequestsPerMinute: 10,
    });
  }

  async validateToken(token: string): Promise<TahTokenPayload> {
    try {
      const decoded = jwt.decode(token, { complete: true });

      if (!decoded || !decoded.header.kid) {
        throw new UnauthorizedException('Invalid token format');
      }

      const key = await this.getSigningKey(decoded.header.kid);

      const payload = jwt.verify(token, key, {
        issuer: this.issuer,
        audience: this.audience,
        algorithms: ['RS256'],
      }) as TahTokenPayload;

      return payload;
    } catch (error: any) {
      this.logger.error(`Token validation failed: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async getSigningKey(kid: string): Promise<string> {
    const key = await this.client.getSigningKey(kid);
    return key.getPublicKey();
  }
}
