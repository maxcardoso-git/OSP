import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { OrgUnitClosure } from '../entities/org-unit-closure.entity';

@Injectable()
export class ClosureTableService {
  constructor(
    @InjectRepository(OrgUnitClosure)
    private readonly repository: Repository<OrgUnitClosure>,
    private readonly dataSource: DataSource,
  ) {}

  async addNode(orgId: string, nodeId: string, parentId: string | null): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Self reference
      await queryRunner.manager.insert(OrgUnitClosure, {
        orgId,
        ancestorId: nodeId,
        descendantId: nodeId,
        depth: 0,
      });

      if (parentId) {
        // Copy parent's ancestors and add new node
        await queryRunner.query(`
          INSERT INTO org_unit_closure (id, org_id, ancestor_id, descendant_id, depth)
          SELECT gen_random_uuid(), $1, ancestor_id, $2, depth + 1
          FROM org_unit_closure
          WHERE descendant_id = $3 AND org_id = $1
        `, [orgId, nodeId, parentId]);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async removeNode(orgId: string, nodeId: string): Promise<void> {
    await this.repository.delete({
      orgId,
      descendantId: nodeId,
    });
  }

  async moveNode(orgId: string, nodeId: string, newParentId: string | null): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get all descendants of the node
      const descendants = await queryRunner.query(`
        SELECT descendant_id FROM org_unit_closure
        WHERE ancestor_id = $1 AND org_id = $2
      `, [nodeId, orgId]);

      const descendantIds = descendants.map((d: any) => d.descendant_id);

      // Delete old paths (except self-references within subtree)
      await queryRunner.query(`
        DELETE FROM org_unit_closure
        WHERE org_id = $1
        AND descendant_id = ANY($2)
        AND ancestor_id != ALL($2)
      `, [orgId, descendantIds]);

      if (newParentId) {
        // Create new paths from new parent's ancestors to all descendants
        await queryRunner.query(`
          INSERT INTO org_unit_closure (id, org_id, ancestor_id, descendant_id, depth)
          SELECT gen_random_uuid(), $1, p.ancestor_id, c.descendant_id, p.depth + c.depth + 1
          FROM org_unit_closure p
          CROSS JOIN org_unit_closure c
          WHERE p.descendant_id = $2
          AND c.ancestor_id = $3
          AND p.org_id = $1
          AND c.org_id = $1
        `, [orgId, newParentId, nodeId]);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAncestors(orgId: string, nodeId: string): Promise<string[]> {
    const result = await this.repository.find({
      where: { orgId, descendantId: nodeId },
      order: { depth: 'DESC' },
    });
    return result.map(r => r.ancestorId);
  }

  async getDescendants(orgId: string, nodeId: string): Promise<string[]> {
    const result = await this.repository.find({
      where: { orgId, ancestorId: nodeId },
      order: { depth: 'ASC' },
    });
    return result.map(r => r.descendantId);
  }
}
