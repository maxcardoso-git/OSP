import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrgUnitType } from './entities/org-unit-type.entity';
import { CreateOrgUnitTypeDto } from './dto/create-org-unit-type.dto';
import { UpdateOrgUnitTypeDto } from './dto/update-org-unit-type.dto';

@Injectable()
export class OrgUnitTypesService {
  constructor(
    @InjectRepository(OrgUnitType)
    private readonly repository: Repository<OrgUnitType>,
  ) {}

  async create(orgId: string, dto: CreateOrgUnitTypeDto): Promise<OrgUnitType> {
    const existing = await this.repository.findOne({
      where: { orgId, code: dto.code },
    });

    if (existing) {
      throw new ConflictException('OrgUnitType with this code already exists');
    }

    const entity = this.repository.create({ ...dto, orgId });
    return this.repository.save(entity);
  }

  async findAll(orgId: string): Promise<OrgUnitType[]> {
    return this.repository.find({
      where: { orgId },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findOne(orgId: string, id: string): Promise<OrgUnitType> {
    const entity = await this.repository.findOne({
      where: { id, orgId },
    });

    if (!entity) {
      throw new NotFoundException('OrgUnitType not found');
    }

    return entity;
  }

  async update(orgId: string, id: string, dto: UpdateOrgUnitTypeDto): Promise<OrgUnitType> {
    const entity = await this.findOne(orgId, id);
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  async remove(orgId: string, id: string): Promise<void> {
    const entity = await this.findOne(orgId, id);
    await this.repository.remove(entity);
  }
}
