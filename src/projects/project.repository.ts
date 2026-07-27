import { Repository } from "typeorm";
import { Project } from "./project.entity";

export class ProjectRepository {
  constructor(private readonly repository: Repository<Project>) {}

  create(project: Partial<Project>) {
    return this.repository.save(project);
  }

  findById(id: string, organisationId: string) {
    return this.repository.findOne({
      where: {
        id,
        organisationId,
      },
    });
  }

  findByTeam(teamId: string, organisationId: string) {
    return this.repository.find({
      where: {
        teamId,
        organisationId,
      },
    });
  }

  save(project: Project) {
    return this.repository.save(project);
  }

  delete(id: string, organisationId: string) {
    return this.repository.delete({
      id,
      organisationId,
    });
  }
}