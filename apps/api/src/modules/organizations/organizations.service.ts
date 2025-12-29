import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly repository: Repository<Organization>,
  ) {}

  async create(orgId: string, dto: CreateOrganizationDto): Promise<Organization> {
    const existing = await this.repository.findOne({
      where: { orgId, code: dto.code },
    });

    if (existing) {
      throw new ConflictException('Organization with this code already exists');
    }

    const entity = this.repository.create({ ...dto, orgId });
    return this.repository.save(entity);
  }

  async findAll(orgId: string): Promise<Organization[]> {
    return this.repository.find({
      where: { orgId },
      order: { name: 'ASC' },
    });
  }

  async findOne(orgId: string, id: string): Promise<Organization> {
    const entity = await this.repository.findOne({
      where: { id, orgId },
    });

    if (!entity) {
      throw new NotFoundException('Organization not found');
    }

    return entity;
  }

  async update(orgId: string, id: string, dto: UpdateOrganizationDto): Promise<Organization> {
    const entity = await this.findOne(orgId, id);
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  async remove(orgId: string, id: string): Promise<void> {
    const entity = await this.findOne(orgId, id);
    await this.repository.remove(entity);
  }
}
