# Admin QE Test Suite

This folder contains Quality Engineering test coverage for the admin system.

## Folder structure

- `tests/unit/`
  - Unit tests for auth, utility, serializer logic.
- `tests/integration/`
  - API route and database interaction tests for admin flows.
- `tests/security/`
  - RBAC, auth/session, and mutation protection checks.
- `tests/performance/`
  - Pagination and large dataset behavior tests.
- `tests/ui/`
  - React component behavior tests for admin UI.
- `tests/e2e/`
  - Playwright end-to-end admin flows.
- `tests/mocks/`
  - Shared Prisma fixtures and test doubles.

## What is covered

- Admin authentication and role verification
- Blog admin CRUD route behavior and bulk actions
- Workflow security (admin vs editor publish)
- API pagination behavior for large datasets
- UI rendering, filters, and form submission behavior
- E2E flow scaffolding for login, analytics, moderation, and failures

## Commands

- `bun run test`
- `bun run test:unit`
- `bun run test:integration`
- `bun run test:ui`
- `bun run test:e2e`

## Notes

- Contract placeholders are included in `tests/integration/admin-domain-contracts.test.ts` for admin modules that are not fully implemented yet (users/vendors/products/orders/categories/payouts/settings).
- Security tests validate authorization boundaries on admin mutation APIs.
