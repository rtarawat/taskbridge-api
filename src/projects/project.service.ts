import { DataSource, Repository } from 'typeorm';
import { Project } from './project.entity';
import type { ProjectStatus } from './project.entity';

export interface CreateProjectInput {
  name: string;
  description?: string;
  teamId: string;
  status?: ProjectStatus;
}

export class ProjectService {
  private readonly repository: Repository<Project>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = dataSource.getRepository(Project);
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const project = this.repository.create({
      ...input,
      status: input.status ?? 'planning',
    });

    return this.repository.save(project);
  }

  async updateStatus(id: string, status: ProjectStatus): Promise<Project> {
    const project = await this.repository.findOneBy({ id });

    if (!project) {
      throw new Error(`Project with id ${id} was not found.`);
    }

    project.status = status;
    return this.repository.save(project);
  }

  async getByTeam(teamId: string): Promise<Project[]> {
    return this.repository.find({ where: { teamId } });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
