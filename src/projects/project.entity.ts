import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export type ProjectStatus =
  | "planning"
  | "active"
  | "completed"
  | "archived";

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 255 })
  teamId!: string;

  @Column({ type: "varchar", length: 255 })
  organisationId!: string;

  @Column({ type: "varchar", length: 50, default: "planning" })
  status!: ProjectStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}