import { DataSource } from "typeorm";
import { NotificationService } from "../src/notifications/notification.service";

let dataSource: DataSource;
let notificationService: NotificationService;

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    synchronize: true,
    entities: [],
  });

  await dataSource.initialize();

  notificationService =
    new NotificationService(dataSource);
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("Notification Service", () => {
  it("should create notifications for all team members", async () => {
    const userIds = ["user1", "user2", "user3"];

    const notifications =
      await notificationService.createNotifications(
        userIds,
        "project1",
        "MILESTONE_UPDATED",
        "Project updated"
      );

    expect(notifications).toHaveLength(3);
  });
});