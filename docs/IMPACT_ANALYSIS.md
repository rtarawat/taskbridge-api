# Impact Analysis: MILESTONE_REOPENED Event & Actor IP Address Capture

## Overview

Mid-sprint, the product team introduced the following change request:

1. Add a new milestone event type: `MILESTONE_REOPENED`
2. Audit entries must capture the actor's IP address

This document analyses the impact of these changes before implementation.

---

# Change Summary

## Change 1: New Event Type

Add support for:

```text
MILESTONE_REOPENED
```

The event should trigger:

- Audit log creation
- Notification generation
- Audit history retrieval support

---

## Change 2: Actor IP Address

Audit entries must capture the originating IP address of the user performing the action.

Example:

```json
{
  "actorUserId": "user-123",
  "actorIpAddress": "192.168.1.100"
}
```

---

# Impact Assessment

## Affected Data Models

### AuditEntry

File:

```text
src/notifications/audit.entity.ts
```

Change Type:

```text
Additive
Database schema change required
```

Required Change:

Add field:

```ts
@Column()
actorIpAddress!: string;
```

Impact:

- Existing audit records remain valid
- New audit entries store IP information

---

### Notification

File:

```text
src/notifications/notification.entity.ts
```

Change Type:

```text
No schema change
```

Impact:

- Notifications continue to function normally
- New event type must be supported

---

# Affected Services

## AuditService

File:

```text
src/notifications/audit.service.ts
```

Change Type:

```text
Additive
```

Required Changes:

- Accept actorIpAddress
- Persist IP address within audit entries
- Support MILESTONE_REOPENED event creation

---

## NotificationService

File:

```text
src/notifications/notification.service.ts
```

Change Type:

```text
Additive
```

Required Changes:

- Generate notifications for MILESTONE_REOPENED event

Example:

```text
Project milestone reopened.
```

---

## ProjectService

File:

```text
src/projects/project.service.ts
```

Change Type:

```text
Additive
```

Required Changes:

- Trigger audit and notification creation when milestone is reopened
- Pass actor IP address to AuditService

---

# API Impact

## POST /audit

Change Type:

```text
Backward Compatible
```

Current Request:

```json
{
  "projectId": "123",
  "eventType": "MILESTONE_UPDATED"
}
```

New Request:

```json
{
  "projectId": "123",
  "eventType": "MILESTONE_REOPENED",
  "actorIpAddress": "192.168.1.100"
}
```

Impact:

No breaking changes because additional fields are additive.

---

## GET /audit/:projectId

Change Type:

```text
Backward Compatible
```

Impact:

Audit history responses may now include:

```json
{
  "actorIpAddress": "192.168.1.100"
}
```

---

# Testing Impact

Affected Files:

```text
tests/audit.test.ts
tests/notification.test.ts
```

New Test Cases Required:

1. Audit entry stores actor IP address
2. MILESTONE_REOPENED generates audit record
3. MILESTONE_REOPENED generates notifications
4. Audit history returns stored IP address

---

# Database Migration Requirement

Migration Required:

```text
Yes
```

Reason:

New database column:

```text
actorIpAddress
```

Migration Impact:

```text
Low Risk
```

Existing data remains intact.

---

# Security & Compliance Risks

## Risk 1: Personal Data Storage

IP addresses may be considered personal information under privacy regulations.

Potential Impact:

- Privacy concerns
- Compliance obligations

Mitigation:

- Restrict access to audit records
- Store IP addresses only for compliance purposes

---

## Risk 2: Sensitive Log Exposure

If audit records are logged directly, IP addresses may appear in application logs.

Potential Impact:

- Information disclosure

Mitigation:

- Mask or redact IP addresses in application logs
- Restrict log access

---

## Risk 3: Data Retention

Storing IP addresses increases data retention obligations.

Potential Impact:

- Compliance risk

Mitigation:

- Follow organisation retention policies
- Review retention periods periodically

---

# Recommended Implementation Sequence

## Step 1

Update AuditEntry model:

```ts
actorIpAddress
```

## Step 2

Create database migration.

## Step 3

Update AuditService.

## Step 4

Add MILESTONE_REOPENED event support.

## Step 5

Update NotificationService.

## Step 6

Update ProjectService integration.

## Step 7

Implement and execute tests.

---

# How Copilot Assisted This Analysis

GitHub Copilot was used to:

- Identify modules affected by the new event type
- Suggest areas impacted by schema changes
- Generate an initial change impact checklist

Human validation was required to:

- Assess multi-tenant implications
- Evaluate privacy and compliance risks
- Determine migration requirements
- Verify backward compatibility of API contracts
- Define implementation sequencing

---

# Recommendation

The proposed change is low-risk and primarily additive in nature.

Support for MILESTONE_REOPENED can be implemented without breaking existing APIs. The main consideration is the secure handling and retention of actor IP addresses within audit records.