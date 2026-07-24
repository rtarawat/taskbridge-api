# Notification & Audit Service Specification

## 1. Overview

The Notification & Audit Service provides a tenant-scoped event processing layer for a multi-tenant B2B SaaS platform. It is responsible for capturing milestone lifecycle events for projects, delivering notifications to all members of the relevant project team, and persisting immutable audit records for compliance, traceability, and support workflows.

This service must enforce organisation-scoped access control and support queryable audit history by project, date range, and event type.

---

## 2. Functional Requirements

### 2.1 Milestone Event Handling
The service must support the following lifecycle operations for project milestone events:
- Create milestone event
- Update milestone event
- Delete milestone event

Each operation must:
- validate input payloads
- associate the event with the correct project and organisation
- emit a notification to all active team members of the project
- create an immutable audit log entry describing the action

### 2.2 Notification Delivery

The service must:

- Create notifications for all team members associated with a project when a project milestone event occurs
- Store notifications in the database
- Allow users to view unread notifications
- Allow users to mark notifications as read

### 2.3 Immutable Audit Logging
The service must:
- store audit entries immutably once created
- prevent modification or deletion of existing audit records
- preserve the original event payload and metadata
- support append-only history for each project

### 2.4 Tenant and Organisation Isolation
The service must ensure that:
- every request is scoped to the caller’s organisation
- no user can read or mutate data belonging to another organisation
- project and audit data are filtered by organisation context in every read/write operation

### 2.5 Audit Querying
The service must expose query capabilities to retrieve audit history by:
- project ID
- date range
- event type
- optionally combined filters such as project ID + date range + event type

---

## 3. Non-Functional Requirements

### 3.1 Security
- All requests must be authenticated and authorised
- Organisation-level isolation must be enforced at the service and repository layers
- Sensitive audit payloads must be protected from unauthorised access
- Audit writing must be append-only and tamper-evident

### 3.2 Reliability
- Audit records must be persisted successfully before the operation is considered complete
- Audit history must remain available for historical review
- Audit records must never be modified or deleted after creation

### 3.3 Performance
- Audit history queries should support filtering by project, date range, and event type
- Database queries should be scoped by organisation to ensure efficient tenant isolation

### 3.4 Observability
- Service operations must generate structured logs
- Validation and authorization failures must be logged
- Audit creation events must be logged

### 3.5 Compliance
- Audit logs must be suitable for regulatory and internal compliance review
- Historical records must preserve the original actor, timestamp, and payload

---

## 4. Data Models

### 4.1 Project

| Field | Type | Description |
|---------|---------|---------|
| id | UUID | Unique project identifier |
| name | string | Project name |
| status | string | Project status |
| teamId | UUID | Assigned team |
| organisationId | UUID | Owning organisation |
| createdAt | datetime | Created timestamp |
| updatedAt | datetime | Updated timestamp |

### 4.2 AuditEntry

| Field | Type | Description |
|---------|---------|---------|
| id | UUID | Audit identifier |
| projectId | UUID | Associated project |
| eventType | string | MILESTONE_CREATED, MILESTONE_UPDATED, MILESTONE_DELETED |
| entityType | string | Entity type being audited |
| entityId | UUID | Entity identifier |
| actorUserId | UUID | User performing action |
| organisationId | UUID | Tenant identifier |
| previousState | JSON | State before change |
| newState | JSON | State after change |
| timestamp | datetime | Audit creation timestamp |

### 4.3 Notification

| Field | Type | Description |
|---------|---------|---------|
| id | UUID | Notification identifier |
| recipientUserId | UUID | Notification recipient |
| projectId | UUID | Related project |
| eventType | string | Triggering event |
| message | string | User-facing message |
| isRead | boolean | Read status |
| createdAt | datetime | Notification timestamp |

---

## 5. API Contracts

### 5.1 POST /audit

Internal endpoint invoked by the Project Service.

Request

```json
{
  "projectId": "project-123",
  "eventType": "MILESTONE_UPDATED",
  "actorUserId": "user-456",
  "organisationId": "org-789",
  "previousState": {},
  "newState": {}
}
```
Response:
```json
{
  "success": true
}
```

### 5.2 Update Milestone Event
PUT /api/v1/projects/{projectId}/milestones/events/{eventId}

Request body:
```json
{
  "eventType": "update",
  "title": "Design review",
  "description": "Updated milestone review",
  "status": "completed"
}
```

Response:
```json
{
  "eventId": "d92a83f9-6d19-4ed4-98f0-3c0d4ffe32bf",
  "status": "accepted"
}
```

### 5.3 Delete Milestone Event
DELETE /api/v1/projects/{projectId}/milestones/events/{eventId}

Response:
```json
{
  "eventId": "d92a83f9-6d19-4ed4-98f0-3c0d4ffe32bf",
  "status": "accepted"
}
```

### 5.4 Query Audit History
GET /api/v1/organisations/{organisationId}/audit-logs

Query parameters:
- projectId: UUID
- startDate: datetime
- endDate: datetime
- eventType: string

Example:
```http
GET /api/v1/organisations/11111111-2222-3333-4444-555555555555/audit-logs?projectId=abc123&startDate=2026-01-01T00:00:00Z&endDate=2026-01-31T23:59:59Z&eventType=update
```

Response:
```json
{
  "items": [
    {
      "id": "audit-1",
      "projectId": "abc123",
      "eventType": "update",
      "actorId": "user-1",
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ],
  "total": 1
}
```

---

## 6. Validation Rules

### 6.1 Common Rules
- `projectId` must be a valid UUID
- `organisationId` must be a valid UUID
- `actorId` must be a valid UUID
- `eventType` must be one of: `create`, `update`, `delete`
- `title` must be non-empty if provided
- `status` must be a supported milestone status value

### 6.2 Notification Rules
- recipientUserId is required
- projectId is required
- eventType is required
- message is required

### 6.3 Audit Rules
- Audit entries may only be created
- Audit entries may not be updated
- Audit entries may not be deleted
- previousState and newState must accurately represent the entity change

---

## 7. Authorization Rules

### 7.1 Identity and Access
- Only authenticated users may access the service
- Users are associated with exactly one organisation context for each request
- All project, notification, and audit operations must be scoped to the caller’s organisation

### 7.2 Permission Model
- `admin` and `owner` may create, update, delete, and read project milestone events and audit records
- `member` may read project milestone events and audit records if they belong to the same organisation and project team
- `member` may not modify audit logs or bypass organisation scoping

### 7.3 Enforcement Rules
- The service must reject requests that attempt to access data outside the caller’s organisation with `403 Forbidden`
- The service must reject requests referencing a project outside the caller’s organisation with `404 Not Found` or `403 Forbidden` depending on the platform’s security posture
- Audit log reads must also enforce organisation scoping even if the project ID is valid

---

## 8. Integration with Project Service

The Notification & Audit Service must integrate with the Project Service via a bounded event-driven contract:

### 8.1 Event Contract
The Project Service should publish domain events when milestone lifecycle operations occur:
- `MILESTONE_CREATED`
- `MILESTONE_UPDATED`
- `MILESTONE_DELETED`

### 8.2 Integration Flow
1. Project Service creates, updates, or deletes a project milestone.
2. Project Service invokes the Notification & Audit Service.
3. The Notification & Audit Service:
   - creates an audit entry
   - creates notifications for project team members
   - stores the records in the database
4. The service returns a success response.

### 8.3 Dependency Considerations
- The Notification & Audit Service must not directly mutate project state unless explicitly designed as a side-effecting processor.
- The Project Service remains the source of truth for project milestone data.
- The Notification & Audit Service should consume events asynchronously to reduce coupling and improve resilience.

---

## 9. Error Handling Strategy

### 9.1 Error Types
- `ValidationError` for invalid input or unsupported values
- `AuthorizationError` for organisation or permission violations
- `NotFoundError` for missing project, milestone, or event records
- `NotificationDeliveryError` for transient or permanent notification failures
- `AuditWriteError` for persistence or append-only enforcement issues

### 9.2 Handling Approach
- Return structured error responses with code, message, and correlation ID
- Retry transient notification issues with exponential backoff
- Persist failed notifications for later retry rather than dropping them
- Ensure audit writing failures do not silently succeed; the system must raise explicit errors if immutable logging cannot be completed

### 9.3 Standard Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request payload is invalid",
    "correlationId": "7f4d9f11-c0d2-4a8d-9b01-d6b4ae51f211"
  }
}
```

---

## 10. Implementation Notes

- Use layered architecture (Controller → Service → Repository → Entity)
- Use TypeORM for database access
- Use Zod for request validation
- Enforce organisation-level data isolation
- Treat audit records as immutable business records
- Generate notifications for all project team members on project milestone changes

---

## 11. Copilot Assistance

GitHub Copilot was used to:

- Generate the initial specification draft
- Suggest API structures
- Propose data model fields
- Suggest validation requirements

Human judgement was applied to:

- Simplify the design to match sprint scope
- Define multi-tenant isolation rules
- Enforce audit immutability requirements
- Align API contracts with project requirements
- Remove unnecessary architectural complexity
