# B-ShowSell Project To-Do List

This checklist tracks the implementation progress of the B-ShowSell project according to the `spec.md` phased build order.

## Phase 1: Foundation
- [x] Set up monorepo (Turborepo).
- [x] Scaffold Next.js web app (Next.js 15, React, TypeScript, Tailwind CSS v4, shadcn/ui).
- [x] Scaffold Backend API (NestJS, TypeScript).
- [x] Initialize ORM (Prisma).
- [x] Create database schema in `schema.prisma` for users, roles, brands, products, campaigns, orders, reviews, and reports.
- [x] Generate Prisma client and run initial database migration.
- [x] Implement NestJS app structure, config module, database module, auth module, and OpenAPI/Swagger documentation.
- [x] Implement authentication (email/password), JWT refresh flow, RBAC guards.
- [x] Create seed scripts for users and initial data.
- [x] Write protected route tests.
- [x] Scaffold Next.js routes: public routes, authenticated layout, role-aware navigation, login, Admin dashboard, Staff routes, Customer account routes.
- [x] Build a shared API client, auth state handling, and route guards for the Next.js web app.

## Phase 2: Core Admin and Staff Operations
- [ ] Implement Admin user management API and UI.
- [ ] Implement brand CRUD API and UI.
- [ ] Implement campaign CRUD, collaboration types, campaign statuses, milestones, and internal reminders.
- [ ] Implement product category and product CRUD for Staff.
- [ ] Implement image upload adapter using local storage.
- [ ] Implement order data model and staff order management screens.

## Phase 3: Customer Commerce
- [ ] Implement public product listing and product detail APIs.
- [ ] Build customer web product browsing and product detail screens.
- [ ] Implement cart APIs and web cart screens.
- [ ] Implement mock checkout and order creation.
- [ ] Implement customer order history and order detail screens.
- [ ] Implement inventory deduction and order status transition validation.

## Phase 4: Content, Affiliate, and Collaboration Revenue
- [ ] Implement advertising article CRUD and publish flow.
- [ ] Implement public article listing and article detail.
- [ ] Implement affiliate link CRUD.
- [ ] Implement affiliate redirect endpoint and click tracking.
- [ ] Link articles, campaigns, brands, products, and affiliate links.
- [ ] Implement revenue records for advertising fees, affiliate commissions, and product sales.

## Phase 5: Reviews, Reports, and Dashboards
- [ ] Implement customer product reviews with purchase verification.
- [ ] Implement staff review moderation.
- [ ] Implement admin revenue report APIs.
- [ ] Implement staff order statistics.
- [ ] Implement campaign KPI dashboard using internal and manually entered social metrics.
- [ ] Implement CSV export for reports.

## Phase 6: Integration Stubs and Polish
- [ ] Implement mock Facebook and TikTok social publishing providers.
- [ ] Implement social post queue (BullMQ/Redis) and retry behavior.
- [ ] Implement manual social metric entry.
- [ ] Implement notification log and mock email/SMS sender.
- [ ] Implement ICS export for campaign milestones.
- [ ] Add final seed data, loading states, empty states, error states, and web smoke tests.
- [ ] Prepare installation guide and user manual.
