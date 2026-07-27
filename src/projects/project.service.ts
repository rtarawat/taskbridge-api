import { DataSource } from "typeorm";
import { Project, ProjectStatus } from "./project.entity";
import { ProjectRepository } from "./project.repository";
import { NotFoundError } from "../common/errors";
import { logger } from "../common/logger";

export interface CreateProjectInput {
  name: string;
  description?: string;
  teamId: string;
  organisationId: string;
  status?: ProjectStatus;
}

export class ProjectService {
  private readonly repository: ProjectRepository;

  constructor(private readonly dataSource: DataSource) {
    this.repository = new ProjectRepository(
      dataSource.getRepository(Project)
    );
  }

  /**
   * Creates a project.
   */
  async create(input: CreateProjectInput): Promise<Project> {
    logger.info("Creating project", input);

    return this.repository.create({
      ...input,
      status: input.status ?? "planning",
    });
  }

  /**
   * Updates project status.
   */
async updateStatus(
  id: string,
  organisationId: string,
  status: ProjectStatus
): Promise<Project> {
  const project = await this.repository.findById(
    id,
    organisationId
  );

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  const previousState = { ...project };

  project.status = status;

  const updatedProject = await this.repository.save(project);

  logger.info("Project status updated", {
    projectId: id,
    status,
  });
   
  return updatedProject;
}

  /**
   * Gets projects by team.
   */
  async getByTeam(
    teamId: string,
    organisationId: string
  ): Promise<Project[]> {
    return this.repository.findByTeam(
      teamId,
      organisationId
    );
  }

  /**
   * Deletes a project.
   */
  async delete(
    id: string,
    organisationId: string
  ): Promise<boolean> {
    const result = await this.repository.delete(
      id,
      organisationId
    );

    logger.info("Project deleted", {
      projectId: id,
    });

    return (result.affected ?? 0) > 0;
  }
}