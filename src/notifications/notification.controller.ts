import { Request, Response } from "express";
import { NotificationService } from "./notification.service";
import { AuditService } from "./audit.service";

export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly auditService: AuditService
  ) {}

  async getNotifications(
    req: Request,
    res: Response
  ) {
    const userId = String(req.params.userId);

    const notifications =
      await this.notificationService.getUnreadNotifications(
        userId
      );

    return res.json(notifications);
  }

  async markNotificationRead(
    req: Request,
    res: Response
  ) {
    const notification =
      await this.notificationService.markAsRead(
        String(req.params.id)
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
        String(req.params.projectId),
        organisationId,
        req.query.eventType as string
      );

    return res.json(audits);
  }
}