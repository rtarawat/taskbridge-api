# TaskBridge Project Standards

## Architecture

Controller -> Service -> Repository -> Entity

## Tech Stack

Node.js
TypeScript
Express
TypeORM
SQLite

## Security

- Validate all input
- Multi tenant isolation
- Organisation scoped data access
- No raw SQL
- Immutable audit entries

## Coding Standards

- Strict typing
- Structured logging
- Async/await
- Repository pattern

## Testing

- Jest
- Service layer tests
- Authorization tests
- Multi-tenant tests