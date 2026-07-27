import { DataSource, Repository } from "typeorm";
import { AuditEntry } from "./audit.entity";

export interface CreateAuditInput {
  projectId: string;
  organisationId: string;
  actorUserId: string;
  eventType: string;
  entityType: string;
  entityId: string;
  previousState: Record<string, any>;
  newState: Record<string, any>;
}

export class AuditService {
  private repository: Repository<AuditEntry>;

  constructor(dataSource: DataSource) {
    this.repository =
      dataSource.getRepository(AuditEntry);
  }

  async createAuditEntry(
    input: CreateAuditInput
  ): Promise<AuditEntry> {
    const entry = this.repository.create(input);

    return this.repository.save(entry);
  }

  async getAuditHistory(
    projectId: string,
    organisationId: string,
    eventType?: string
  ): Promise<AuditEntry[]> {
    const query =
      this.repository.createQueryBuilder("audit");

    query.where("audit.projectId = :projectId", {
      projectId,
    });

    query.andWhere(
      "audit.organisationId = :organisationId",
      { organisationId }
    );

    if (eventType) {
      query.andWhere(
        "audit.eventType = :eventType",
        { eventType }
      );
    }

    return query.getMany();
  }
}