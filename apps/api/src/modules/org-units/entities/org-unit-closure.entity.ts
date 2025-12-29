import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrgUnit } from './org-unit.entity';

@Entity('org_unit_closure')
@Index(['orgId', 'ancestorId', 'descendantId'], { unique: true })
@Index(['orgId', 'descendantId'])
export class OrgUnitClosure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'org_id' })
  orgId: string;

  @Column({ name: 'ancestor_id' })
  ancestorId: string;

  @ManyToOne(() => OrgUnit)
  @JoinColumn({ name: 'ancestor_id' })
  ancestor: OrgUnit;

  @Column({ name: 'descendant_id' })
  descendantId: string;

  @ManyToOne(() => OrgUnit)
  @JoinColumn({ name: 'descendant_id' })
  descendant: OrgUnit;

  @Column({ default: 0 })
  depth: number;
}
