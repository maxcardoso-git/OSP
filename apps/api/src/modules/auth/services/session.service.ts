import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserSession } from '../entities/user-session.entity';

interface SessionData {
  email: string;
  name?: string;
  permissions: string[];
}

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserSession)
    private sessionRepository: Repository<UserSession>,
  ) {}

  async findOrCreateSession(
    tahUserId: string,
    orgId: string,
    data: SessionData,
  ): Promise<UserSession> {
    // Find or create user
    let user = await this.userRepository.findOne({
      where: { tahUserId, orgId },
    });

    if (!user) {
      user = this.userRepository.create({
        tahUserId,
        orgId,
        email: data.email,
        name: data.name,
        isActive: true,
      });
      user = await this.userRepository.save(user);
      this.logger.log(`Created new user: ${user.id}`);
    } else {
      // Update user info if changed
      let updated = false;
      if (data.email && user.email !== data.email) {
        user.email = data.email;
        updated = true;
      }
      if (data.name && user.name !== data.name) {
        user.name = data.name;
        updated = true;
      }
      if (updated) {
        user = await this.userRepository.save(user);
      }
    }

    // Update last login
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    // Find or create session
    let session = await this.sessionRepository.findOne({
      where: { userId: user.id, isActive: true },
      relations: ['user'],
    });

    if (!session) {
      session = this.sessionRepository.create({
        userId: user.id,
        permissions: data.permissions,
        isActive: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });
      session = await this.sessionRepository.save(session);
      session.user = user;
    } else {
      // Update permissions if changed
      if (JSON.stringify(session.permissions) !== JSON.stringify(data.permissions)) {
        session.permissions = data.permissions;
        session.lastActivityAt = new Date();
        await this.sessionRepository.save(session);
      }
    }

    return session;
  }

  async invalidateSession(sessionId: string): Promise<void> {
    await this.sessionRepository.update(sessionId, { isActive: false });
  }
}
