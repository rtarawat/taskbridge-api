import { Request, Response } from "express";
import { ProjectService } from "./project.service";

export class ProjectController {
  constructor(
    private readonly projectService: ProjectService
  ) {}

  async getByTeam(req: Request, res: Response) {
    const teamId = String(req.params.teamId);
    const organisationId = String(req.header("x-org-id"));

    const projects =
      await this.projectService.getByTeam(
        teamId,
        organisationId
      );

    res.json(projects);
  }
}