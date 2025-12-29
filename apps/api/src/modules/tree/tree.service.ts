import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrgUnit } from '../org-units/entities/org-unit.entity';
import { OrgUnitClosure } from '../org-units/entities/org-unit-closure.entity';

export interface TreeNode {
  id: string;
  name: string;
  code: string | null;
  typeId: string;
  parentId: string | null;
  depth: number;
  isActive: boolean;
  children: TreeNode[];
}

@Injectable()
export class TreeService {
  constructor(
    @InjectRepository(OrgUnit)
    private readonly orgUnitRepository: Repository<OrgUnit>,
    @InjectRepository(OrgUnitClosure)
    private readonly closureRepository: Repository<OrgUnitClosure>,
  ) {}

  async getTree(orgId: string, rootId?: string, maxDepth?: number): Promise<TreeNode[]> {
    // Get all units
    const units = await this.orgUnitRepository.find({
      where: { orgId, isActive: true },
      relations: ['type'],
      order: { name: 'ASC' },
    });

    // Build tree structure
    const nodeMap = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    // Create nodes
    for (const unit of units) {
      nodeMap.set(unit.id, {
        id: unit.id,
        name: unit.name,
        code: unit.code,
        typeId: unit.typeId,
        parentId: unit.parentId,
        depth: 0,
        isActive: unit.isActive,
        children: [],
      });
    }

    // Build tree
    for (const unit of units) {
      const node = nodeMap.get(unit.id);
      if (!node) continue;

      if (unit.parentId && nodeMap.has(unit.parentId)) {
        const parent = nodeMap.get(unit.parentId);
        if (parent) {
          node.depth = parent.depth + 1;
          parent.children.push(node);
        }
      } else if (!rootId || unit.id === rootId) {
        roots.push(node);
      }
    }

    // Filter by rootId if specified
    if (rootId) {
      const rootNode = nodeMap.get(rootId);
      return rootNode ? [rootNode] : [];
    }

    // Filter by maxDepth if specified
    if (maxDepth !== undefined) {
      this.filterByDepth(roots, 0, maxDepth);
    }

    return roots;
  }

  private filterByDepth(nodes: TreeNode[], currentDepth: number, maxDepth: number): void {
    for (const node of nodes) {
      if (currentDepth >= maxDepth) {
        node.children = [];
      } else {
        this.filterByDepth(node.children, currentDepth + 1, maxDepth);
      }
    }
  }

  async getPath(orgId: string, nodeId: string): Promise<OrgUnit[]> {
    const closures = await this.closureRepository.find({
      where: { orgId, descendantId: nodeId },
      order: { depth: 'DESC' },
    });

    const ancestorIds = closures.map(c => c.ancestorId);
    
    if (ancestorIds.length === 0) return [];

    const units = await this.orgUnitRepository.findByIds(ancestorIds);
    
    // Sort by depth (root first)
    const idOrder = new Map(ancestorIds.map((id, index) => [id, index]));
    return units.sort((a, b) => (idOrder.get(b.id) || 0) - (idOrder.get(a.id) || 0));
  }
}
