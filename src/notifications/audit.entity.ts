import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("audit_entries")
export class AuditEntry {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  projectId!: string;

  @Column()
  organisationId!: string;

  @Column()
  eventType!: string;

  @Column()
  entityType!: string;

  @Column()
  entityId!: string;

  @Column()
  actorUserId!: string;

  @Column("simple-json")
  previousState!: Record<string, any>;

  @Column("simple-json")
  newState!: Record<string, any>;

  @CreateDateColumn()
  timestamp!: Date;
}