import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrgUnit } from '../entities/org-unit.entity';
import { ClosureTableService } from './closure-table.service';
import { CreateOrgUnitDto } from '../dto/create-org-unit.dto';
import { UpdateOrgUnitDto } from '../dto/update-org-unit.dto';
import { MoveOrgUnitDto } from '../dto/move-org-unit.dto';

@Injectable()
export class OrgUnitsService {
  constructor(
    @InjectRepository(OrgUnit)
    private readonly repository: Repository<OrgUnit>,
    private readonly closureService: ClosureTableService,
  ) {}

  async create(orgId: string, dto: CreateOrgUnitDto): Promise<OrgUnit> {
    const entity = this.repository.create({ ...dto, orgId });
    const saved = await this.repository.save(entity);
    
    await this.closureService.addNode(orgId, saved.id, dto.parentId || null);
    
    return saved;
  }

  async findAll(orgId: string): Promise<OrgUnit[]> {
    return this.repository.find({
      where: { orgId },
      relations: ['type'],
      order: { name: 'ASC' },
    });
  }

  async findOne(orgId: string, id: string): Promise<OrgUnit> {
    const entity = await this.repository.findOne({
      where: { id, orgId },
      relations: ['type'],
    });

    if (!entity) {
      throw new NotFoundException('OrgUnit not found');
    }

    return entity;
  }

  async update(orgId: string, id: string, dto: UpdateOrgUnitDto): Promise<OrgUnit> {
    const entity = await this.findOne(orgId, id);
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  async move(orgId: string, id: string, dto: MoveOrgUnitDto): Promise<OrgUnit> {
    const entity = await this.findOne(orgId, id);

    // Prevent moving to self or descendant
    if (dto.newParentId) {
      const descendants = await this.closureService.getDescendants(orgId, id);
      if (descendants.includes(dto.newParentId)) {
        throw new BadRequestException('Cannot move node to its own descendant');
      }
    }

    await this.closureService.moveNode(orgId, id, dto.newParentId);
    
    entity.parentId = dto.newParentId;
    return this.repository.save(entity);
  }

  async remove(orgId: string, id: string): Promise<void> {
    const entity = await this.findOne(orgId, id);
    
    // Check for children
    const children = await this.repository.find({
      where: { orgId, parentId: id },
    });

    if (children.length > 0) {
      throw new BadRequestException('Cannot delete node with children');
    }

    await this.closureService.removeNode(orgId, id);
    await this.repository.remove(entity);
  }

  async getChildren(orgId: string, parentId: string | null): Promise<OrgUnit[]> {
    return this.repository.find({
      where: { orgId, parentId: parentId || undefined },
      relations: ['type'],
      order: { name: 'ASC' },
    });
  }
}
