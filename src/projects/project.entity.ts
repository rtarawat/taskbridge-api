import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type ProjectStatus = 'planning' | 'active' | 'completed' | 'archived';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 255 })
  teamId!: string;

  @Column({ type: 'varchar', length: 50, default: 'planning' })
  status!: ProjectStatus;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
