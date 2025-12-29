import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from "typeorm";
import { UserSession } from "./user-session.entity";

@Entity("users")
@Index(["tahUserId", "orgId"], { unique: true })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "tah_user_id" })
  @Index()
  tahUserId: string;

  @Column({ name: "org_id" })
  @Index()
  orgId: string;

  @Column()
  @Index()
  email: string;

  @Column()
  name: string;

  @Column({ name: "avatar_url", nullable: true })
  avatarUrl: string;

  @Column({ name: "is_active", default: true })
  isActive: boolean;

  @Column({ name: "last_login_at", type: "timestamp with time zone", nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;

  @OneToMany(() => UserSession, (session) => session.user)
  sessions: UserSession[];
}
