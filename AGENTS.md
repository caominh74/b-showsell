# B-ShowSell Project Guidelines for AI Agents

## Project Overview
B-ShowSell is a responsive web application for a Vietnamese beauty blogger and her team. It centralizes brand collaboration management, promotional content, affiliate performance, product catalog operations, customer checkout, and order tracking.

## Workspace And Stack
- Root repository: Turborepo monorepo.
- Frontend: `apps/web`, Next.js App Router, React, TypeScript, Tailwind CSS v4, shadcn/ui-style components.
- Backend: `apps/api`, NestJS, TypeScript, Prisma, PostgreSQL.
- API docs are configured at `/api/docs`; API dev port is `3001`, web dev port is `3000`.
- Prisma schema lives at `apps/api/prisma/schema.prisma`.

## Working Rules
- Read `spec.md` and `todo.md` before implementing project phases.
- Keep `todo.md` updated when phase items are completed.
- Use `AGENTS.md` as the canonical agent instruction file. Do not create a singular `AGENT.md`.
- Read `D:\codex-data\RTK.md`; shell commands should be prefixed with `rtk` where possible.
- Use standard NestJS architecture: modules, controllers, services, DTOs.
- Enforce JWT authentication and RBAC at the controller/service boundary.
- Validate request bodies with DTO classes and class-validator.
- Do not initialize nested git repositories.

## Current Implementation Notes
- Phase 1, Phase 2, and Phase 3 are marked complete in `todo.md`.
- Phase 2 added Admin user/brand/campaign/milestone management, Staff product/category/image management, and Staff order management.
- Phase 3 added public product listing/detail APIs and pages, customer cart APIs/pages, mock checkout/order creation, customer order history/detail pages, inventory deduction for paid mock orders, and customer cancellation for pending-payment orders.
- Phase 4 should focus on advertising article CRUD/publish flow, public article pages, affiliate link CRUD, affiliate redirects/click tracking, linking articles to campaigns/brands/products/affiliate links, and collaboration/product-sale revenue records.
