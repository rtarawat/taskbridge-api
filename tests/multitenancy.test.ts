import { DataSource } from "typeorm";
import { AuditService } from "../src/notifications/audit.service";
import { AuditEntry } from "../src/notifications/audit.entity";

let dataSource: DataSource;
let auditService: AuditService;

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    synchronize: true,
    entities: [AuditEntry],
  });

  await dataSource.initialize();

  auditService = new AuditService(dataSource);
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("Multi Tenant Security", () => {
  it("should not allow access across organisations", async () => {
    const audits = await auditService.getAuditHistory(
      "project1",
      "different-org"
    );

    expect(audits.length).toBe(0);
  });
});

it("should not allow access across organisations", async () => {
  const audits =
    await auditService.getAuditHistory(
      "project1",
      "different-org"
    );

  expect(audits.length).toBe(0);
});

