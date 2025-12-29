import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AuditEvent, AuditAction } from './entities/audit-event.entity';

interface CreateAuditEventDto {
  orgId: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  userId?: string;
  userEmail?: string;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
}

interface AuditQueryParams {
  orgId: string;
  entityType?: string;
  entityId?: string;
  action?: AuditAction;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditEvent)
    private auditRepository: Repository<AuditEvent>,
  ) {}

  async create(dto: CreateAuditEventDto): Promise<AuditEvent> {
    const event = this.auditRepository.create(dto);
    const saved = await this.auditRepository.save(event);
    this.logger.debug(`Audit event created: ${saved.id}`);
    return saved;
  }

  async findAll(params: AuditQueryParams) {
    const { orgId, entityType, entityId, action, userId, startDate, endDate, page = 1, limit = 50 } = params;

    const where: any = { orgId };
    
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (action) where.action = action;
    if (userId) where.userId = userId;
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    }

    const [data, total] = await this.auditRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByEntity(orgId: string, entityType: string, entityId: string): Promise<AuditEvent[]> {
    return this.auditRepository.find({
      where: { orgId, entityType, entityId },
      order: { createdAt: 'DESC' },
    });
  }
}
