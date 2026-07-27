import { DataSource, Repository } from "typeorm";
import { Notification } from "./notification.entity";

export class NotificationService {
  private repository: Repository<Notification>;

  constructor(dataSource: DataSource) {
    this.repository =
      dataSource.getRepository(Notification);
  }

  async createNotifications(
    userIds: string[],
    projectId: string,
    eventType: string,
    message: string
  ) {
    const notifications = userIds.map(
      (recipientUserId) =>
        this.repository.create({
          recipientUserId,
          projectId,
          eventType,
          message,
        })
    );

    return this.repository.save(notifications);
  }

  async getUnreadNotifications(
    userId: string
  ) {
    return this.repository.find({
      where: {
        recipientUserId: userId,
        isRead: false,
      },
    });
  }

  async markAsRead(id: string) {
    const notification =
      await this.repository.findOneBy({ id });

    if (!notification) {
      throw new Error("Notification not found");
    }

    notification.isRead = true;

    return this.repository.save(notification);
  }
}