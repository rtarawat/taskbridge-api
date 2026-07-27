import { Request, Response } from "express";
import { NotificationService } from "./notification.service";
import { AuditService } from "./audit.service";

export class NotificationController {
  constructor(
    private notificationService: NotificationService,
    private auditService: AuditService
  ) {}

  async getNotifications(
    req: Request,
    res: Response
  ) {
    const notifications =
      await this.notificationService.getUnreadNotifications(
        req.params.userId
      );

    return res.json(notifications);
  }

  async markNotificationRead(
    req: Request,
    res: Response
  ) {
    const notification =
      await this.notificationService.markAsRead(
        req.params.id
      );

    return res.json(notification);
  }

  async getAuditHistory(
    req: Request,
    res: Response
  ) {
    const organisationId = String(
      req.header("x-org-id")
    );

    const audits =
      await this.auditService.getAuditHistory(
        req.params.projectId,
        organisationId,
        req.query.eventType as string
      );

    return res.json(audits);
  }
}