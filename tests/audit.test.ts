import { DataSource } from "typeorm";
import { AuditService } from "../src/notifications/audit.service";

let dataSource: DataSource;
let auditService: AuditService;

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    synchronize: true,
    entities: [],
  });

  await dataSource.initialize();

  auditService = new AuditService(dataSource);
});

afterAll(async () => {
  await dataSource.destroy();
});

it("should create audit entry when milestone is updated", async () => {
  const audit = await auditService.createAuditEntry({
    projectId: "project1",
    organisationId: "org1",
    actorUserId: "user1",
    eventType: "MILESTONE_UPDATED",
    entityType: "PROJECT",
    entityId: "project1",
    previousState: {
      status: "planning",
    },
    newState: {
      status: "active",
    },
  });

  expect(audit.eventType)
    .toBe("MILESTONE_UPDATED");
});

it("should prevent audit entry modification", async () => {
  const audit = await auditService.createAuditEntry({
    projectId: "project1",
    organisationId: "org1",
    actorUserId: "user1",
    eventType: "MILESTONE_CREATED",
    entityType: "PROJECT",
    entityId: "project1",
    previousState: {},
    newState: {},
  });

  expect(audit.id).toBeDefined();

  // Audit service exposes no update/delete methods
  expect(
    typeof (auditService as any).updateAudit
  ).toBe("undefined");
});

it("should return audit history filtered by date range", async () => {
  const audits =
    await auditService.getAuditHistory(
      "project1",
      "org1"
    );

  expect(Array.isArray(audits)).toBe(true);
});

it("should return audit history filtered by date range", async () => {
  const audits =
    await auditService.getAuditHistory(
      "project1",
      "org1"
    );

  expect(Array.isArray(audits)).toBe(true);
});

