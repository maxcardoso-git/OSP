import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrgUnitType } from '../../org-unit-types/entities/org-unit-type.entity';

@Entity('org_units')
@Index(['orgId', 'code'], { unique: true })
@Index(['orgId', 'parentId'])
export class OrgUnit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'org_id' })
  orgId: string;

  @Column({ length: 50, nullable: true })
  code: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'type_id' })
  typeId: string;

  @ManyToOne(() => OrgUnitType)
  @JoinColumn({ name: 'type_id' })
  type: OrgUnitType;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
