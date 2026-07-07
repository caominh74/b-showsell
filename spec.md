# B-ShowSell Project Specification

## 1. Product Overview

B-ShowSell is a responsive web application for a Vietnamese beauty blogger and her team. The system helps the blogger manage brand collaboration campaigns, publish promotional content, track affiliate and advertising performance, and sell beauty products directly to customers.

### Core Product Idea

Create one operational system where the blogger's team can:

- Manage brands, collaboration campaigns, campaign milestones, content deliverables, affiliate links, and campaign revenue.
- Publish advertising articles and product promotion content to the website.
- Track performance metrics such as posts, videos, reach, impressions, engagement, CTR, affiliate clicks, advertising income, and sales income.
- Manage an online beauty product catalog, customer orders, product reviews, and order reports.
- Let customers browse, purchase, and review beauty products.

### Problem Solved

Beauty bloggers often manage brand collaborations, affiliate links, content schedules, revenue, and direct product sales across disconnected tools such as spreadsheets, social platforms, chat apps, and e-commerce sites. This makes it difficult to know campaign status, collaboration income, order status, and total business performance in one place.

B-ShowSell centralizes collaboration management and direct product sales so the blogger's team can operate campaigns and commerce workflows from a single system.

### Target Users

- Beauty blogger business owner/admin who manages users, brands, collaborations, reports, and publishing.
- Internal staff who manage products and customer orders.
- Customers who browse products, buy beauty products, and leave reviews.
- Website visitors who can browse public product and blog content before creating an account.

## 2. User Roles and Permissions

### Admin

Admin users have full system-level access.

Concrete permissions/actions:

- Manage global configuration settings.
- Create, view, update, deactivate, and reactivate users.
- Assign user roles: Admin, Staff, Customer.
- Manage brand profiles.
- Manage brand commission rates.
- Create and manage collaboration campaigns.
- Manage campaign milestones and calendar reminders.
- Create, edit, publish, unpublish, and delete advertising articles.
- Attach products, brands, campaign links, and affiliate links to advertising content.
- Trigger or queue social media posting jobs for Facebook and TikTok integrations.
- View collaboration KPI dashboard.
- View total collaboration campaigns by month, quarter, and year.
- View posts and promotional videos per campaign.
- View reach, impressions, likes, comments, and shares by campaign and channel.
- View CTR for promotional links.
- View most effective social media channel.
- View income reports from advertising, affiliate links, and product sales.
- View order statistics and sales reports.
- Export reports as CSV.

### Staff

Staff users manage commerce operations but do not manage system settings or users.

Concrete permissions/actions:

- Create, view, update, archive, and restore products.
- Manage product categories, product images, pricing, stock, and product visibility.
- View customer orders.
- Update order status.
- Add shipment or delivery notes.
- Cancel orders when allowed by status.
- Manage order fulfillment workflow.
- View order-related reports and statistics.
- Moderate customer product reviews.
- Reply to product reviews if enabled.

### Customer

Customer users interact with the public store and their own orders.

Concrete permissions/actions:

- Register, log in, log out, and manage own profile.
- Browse public products.
- Search and filter products.
- View product details.
- Add products to cart.
- Update cart quantities.
- Place orders.
- View own order history and order status.
- Cancel own pending order when allowed.
- Review purchased products.
- View public advertising articles and affiliate content.
- Click affiliate links that redirect to external marketplaces.

### Guest

Guest users are unauthenticated visitors.

Concrete permissions/actions:

- View published products.
- Search and filter products.
- View published advertising articles.
- Click public affiliate links.
- Register or log in.
- Cannot place orders, review products, or access private account data.

## 3. Feature Areas

### 3.1 Authentication and RBAC

- Email/password registration and login.
- JWT-based access tokens and refresh tokens.
- Role-based access control for Admin, Staff, Customer, and Guest access.
- User account statuses: active, inactive, suspended.
- Password reset flow.
- User profile management.

### 3.2 Admin User and System Management

- Admin dashboard shell with navigation for users, brands, campaigns, content, products, orders, and reports.
- User management screens for creating users, assigning roles, disabling accounts, and viewing account activity.
- Configuration settings screen for business values such as default commission rate, low-stock threshold, report timezone, and support contact details.

### 3.3 Brand and Collaboration Management

- Brand directory with contact information, social links, and default commission settings.
- Campaign creation and management.
- Collaboration types:
  - Advertising.
  - Affiliate marketing.
  - Brand ambassador.
  - Co-producing limited-edition products.
- Campaign lifecycle:
  - Draft.
  - Planned.
  - In progress.
  - Completed.
  - Cancelled.
- Campaign deliverables:
  - Blog post.
  - Video.
  - Social post.
  - Affiliate link.
  - Product launch.
- Milestones and reminders for campaign deadlines.
- Campaign revenue tracking:
  - Advertising fee.
  - Affiliate commission.
  - Product sales profit.

### 3.4 Content and Affiliate Link Management

- Admin can create advertising articles for the website.
- Articles can be linked to brands, campaigns, products, and affiliate links.
- Articles support draft, scheduled, published, and archived states.
- Affiliate links redirect users to external e-commerce platforms such as Shopee or Lazada.
- Affiliate click tracking records click time, source article, campaign, product, channel, and anonymous/session user context.
- Admin can view CTR and click reports.

### 3.5 Social Publishing and KPI Tracking

- Admin can prepare content for website publishing and social media posting.
- Facebook and TikTok publishing actions are queued as integration jobs.
- For v1, social publishing and metrics import are stubbed unless real API credentials are provided.
- KPI dashboard groups campaign metrics by campaign, channel, and time period.
- Supported metrics:
  - Campaign count by month, quarter, and year.
  - Number of posts and promotional videos per campaign.
  - Reach.
  - Impressions.
  - Likes.
  - Comments.
  - Shares.
  - Affiliate clicks.
  - CTR.
  - Advertising revenue.
  - Affiliate commission revenue.
  - Direct product sales revenue.
  - Total income.

### 3.6 Product Catalog

- Staff can manage product listings.
- Product fields include name, slug, description, category, brand, price, sale price, stock quantity, images, ingredients, usage instructions, status, and visibility.
- Customers and guests can browse, search, filter, and view products.
- Product statuses:
  - Draft.
  - Active.
  - Out of stock.
  - Archived.
- Low-stock indicators appear in staff product management.

### 3.7 Cart, Checkout, and Orders

- Customers can add products to a cart.
- Customers can update item quantities or remove items.
- Checkout captures shipping address, contact phone, and order notes.
- Payment is stubbed for v1 using a mock payment status.
- Orders support statuses:
  - Pending payment.
  - Paid.
  - Processing.
  - Shipped.
  - Delivered.
  - Cancelled.
  - Refunded.
- Staff can view and update orders.
- Customers can view own orders.
- Inventory is reduced after order confirmation.

### 3.8 Product Reviews

- Customers can review products they purchased.
- Reviews include rating, title, body, optional images, status, and moderation metadata.
- Staff can approve, reject, or hide reviews.
- Public product pages show approved reviews only.

### 3.9 Reporting and Analytics

- Admin can view combined revenue reports:
  - Advertising income.
  - Affiliate commission.
  - Product sales revenue.
  - Product sales profit.
  - Total income.
- Staff can view order-related reports:
  - Order count.
  - Revenue by date range.
  - Best-selling products.
  - Orders by status.
- Reports support date range filters and CSV export.
- Dashboard charts should use internal data first and allow manual social metric entry for v1.

## 4. Recommended Tech Stack

Recommended stack:

- Monorepo: Turborepo.
- Web app: Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query.
- Web app routes: Admin dashboard, Staff operations portal, Customer storefront/account area, and Guest public pages.
- Backend API: NestJS, TypeScript.
- Database: PostgreSQL.
- ORM: Prisma.
- Authentication: NestJS Passport, JWT access tokens, refresh tokens, bcrypt password hashing.
- File storage for product/review images: local filesystem adapter for v1, S3-compatible adapter interface for later.
- Background jobs: BullMQ with Redis for social publishing jobs, reminder jobs, and report exports.
- Charts: Recharts for web dashboards.
- API documentation: OpenAPI/Swagger generated by NestJS.
- Testing: Jest for backend unit tests, Supertest for API tests, Playwright for web smoke tests.
- Deployment target: Docker Compose for local and staging, with separate services for API, PostgreSQL, Redis, and web development.

Rationale: This stack keeps v1 focused on one responsive web application plus a backend API, while keeping data modeling and API contracts strongly typed and suitable for agent-based scaffolding.

## 5. V1 Scope and Non-Goals

### Fully Implemented in V1

- Authentication and RBAC.
- Responsive web application for Admin, Staff, Customer, and Guest users.
- Admin and Staff authenticated dashboards.
- Customer storefront, account, cart, checkout, orders, and reviews in the web app.
- User management.
- Brand management.
- Campaign management.
- Campaign milestones and internal reminders.
- Advertising article CRUD and website publishing.
- Affiliate link CRUD, redirect handling, and click tracking.
- Product catalog management.
- Customer product browsing.
- Cart and checkout flow.
- Order management.
- Product review flow with moderation.
- Internal dashboards and reports using system data.
- CSV export for reports.
- Seed data for roles, users, brands, campaigns, products, orders, and reviews.

### Non-Goals / Mocked or Stubbed for V1

- Real Facebook API posting is not fully implemented in v1. Provide a SocialPublishingProvider interface and a mock provider that records queued posts and fake provider responses.
- Real TikTok API posting is not fully implemented in v1. Provide a mock provider with the same job lifecycle as Facebook.
- Automatic social metrics import is not fully implemented in v1. Allow manual metric entry and seeded sample metrics.
- Real Shopee, Lazada, or external marketplace API integration is not implemented in v1. Affiliate links redirect to configured URLs and track clicks only.
- Real payment gateway integration is not implemented in v1. Checkout uses a mock payment provider with controllable success/failure responses.
- Real shipping provider integration is not implemented in v1. Staff can manually update shipment notes and order status.
- Real Google Calendar or external calendar sync is not implemented in v1. Implement internal milestone reminders and expose an ICS export endpoint.
- Real email/SMS sending is not required in v1. Use a notification log table and mock sender.
- Advanced AI content generation, recommendation engines, and influencer fraud detection are not part of v1.
- Multi-vendor marketplace functionality is not part of v1. Products are sold by the blogger's business only.
- Native iOS, Android, Expo, or React Native apps are not part of v1. All customer functionality must be implemented in the responsive web app.

## 6. High-Level Data Model

### User

Key fields:

- id.
- email.
- passwordHash.
- fullName.
- phone.
- role: ADMIN, STAFF, CUSTOMER.
- status: ACTIVE, INACTIVE, SUSPENDED.
- avatarUrl.
- createdAt.
- updatedAt.

Relationships:

- Customer users can have many orders, carts, reviews, and affiliate clicks.
- Admin and Staff users can create or update campaigns, products, articles, and orders.

### Brand

Key fields:

- id.
- name.
- slug.
- description.
- contactName.
- contactEmail.
- contactPhone.
- websiteUrl.
- facebookUrl.
- tiktokUrl.
- defaultCommissionRate.
- status.
- createdAt.
- updatedAt.

Relationships:

- Brand has many products.
- Brand has many campaigns.
- Brand has many affiliate links.

### Campaign

Key fields:

- id.
- brandId.
- name.
- description.
- collaborationType: ADVERTISING, AFFILIATE, BRAND_AMBASSADOR, LIMITED_EDITION.
- status: DRAFT, PLANNED, IN_PROGRESS, COMPLETED, CANCELLED.
- startDate.
- endDate.
- advertisingFee.
- expectedCommissionRate.
- actualAffiliateCommission.
- notes.
- createdById.
- createdAt.
- updatedAt.

Relationships:

- Campaign belongs to one brand.
- Campaign has many milestones, deliverables, articles, affiliate links, social posts, and metrics.

### CampaignMilestone

Key fields:

- id.
- campaignId.
- title.
- description.
- dueAt.
- reminderAt.
- status: PENDING, DONE, OVERDUE, CANCELLED.
- assignedToId.
- createdAt.
- updatedAt.

Relationships:

- Milestone belongs to one campaign.
- Milestone may be assigned to an Admin or Staff user.

### ContentArticle

Key fields:

- id.
- campaignId.
- brandId.
- title.
- slug.
- excerpt.
- bodyMarkdown.
- coverImageUrl.
- status: DRAFT, SCHEDULED, PUBLISHED, ARCHIVED.
- publishedAt.
- scheduledAt.
- authorId.
- createdAt.
- updatedAt.

Relationships:

- Article may belong to a campaign.
- Article may link to multiple products and affiliate links.
- Article may produce social posts.

### AffiliateLink

Key fields:

- id.
- campaignId.
- brandId.
- productId.
- articleId.
- label.
- destinationUrl.
- trackingCode.
- channel: WEBSITE, FACEBOOK, TIKTOK, OTHER.
- commissionRate.
- clickCount.
- status: ACTIVE, INACTIVE.
- createdAt.
- updatedAt.

Relationships:

- Affiliate link belongs to a brand and optionally to a campaign, product, and article.
- Affiliate link has many affiliate clicks.

### AffiliateClick

Key fields:

- id.
- affiliateLinkId.
- customerId nullable.
- sessionId.
- ipHash.
- userAgent.
- referrer.
- clickedAt.

Relationships:

- Click belongs to one affiliate link.
- Click may belong to one customer.

### SocialPost

Key fields:

- id.
- campaignId.
- articleId.
- platform: WEBSITE, FACEBOOK, TIKTOK.
- status: DRAFT, QUEUED, POSTED, FAILED.
- postUrl.
- providerPostId.
- scheduledAt.
- postedAt.
- errorMessage.
- createdById.
- createdAt.
- updatedAt.

Relationships:

- Social post belongs to a campaign and optionally an article.
- Social post has many social metrics snapshots.

### SocialMetric

Key fields:

- id.
- campaignId.
- socialPostId.
- platform.
- metricDate.
- reach.
- impressions.
- likes.
- comments.
- shares.
- clicks.
- ctr.
- source: MANUAL, IMPORTED, SEEDED.
- createdAt.
- updatedAt.

Relationships:

- Metric belongs to one campaign.
- Metric may belong to one social post.

### ProductCategory

Key fields:

- id.
- name.
- slug.
- description.
- parentId nullable.
- status.

Relationships:

- Category has many products.
- Category can have parent and child categories.

### Product

Key fields:

- id.
- brandId.
- categoryId.
- name.
- slug.
- description.
- ingredients.
- usageInstructions.
- price.
- salePrice nullable.
- costPrice.
- stockQuantity.
- lowStockThreshold.
- status: DRAFT, ACTIVE, OUT_OF_STOCK, ARCHIVED.
- isLimitedEdition.
- createdAt.
- updatedAt.

Relationships:

- Product belongs to one brand.
- Product belongs to one category.
- Product has many images, order items, reviews, affiliate links, and article links.

### ProductImage

Key fields:

- id.
- productId.
- url.
- altText.
- sortOrder.
- isPrimary.

### Cart

Key fields:

- id.
- customerId.
- status: ACTIVE, CONVERTED, ABANDONED.
- createdAt.
- updatedAt.

Relationships:

- Cart belongs to one customer.
- Cart has many cart items.

### CartItem

Key fields:

- id.
- cartId.
- productId.
- quantity.
- unitPriceSnapshot.

### Order

Key fields:

- id.
- orderNumber.
- customerId.
- status: PENDING_PAYMENT, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED.
- paymentStatus: MOCK_PENDING, MOCK_PAID, MOCK_FAILED, MOCK_REFUNDED.
- subtotal.
- shippingFee.
- discountTotal.
- total.
- recipientName.
- recipientPhone.
- shippingAddressLine1.
- shippingAddressLine2.
- ward.
- district.
- city.
- notes.
- placedAt.
- updatedAt.

Relationships:

- Order belongs to one customer.
- Order has many order items.

### OrderItem

Key fields:

- id.
- orderId.
- productId.
- productNameSnapshot.
- unitPriceSnapshot.
- quantity.
- lineTotal.

### ProductReview

Key fields:

- id.
- productId.
- customerId.
- orderId.
- rating.
- title.
- body.
- status: PENDING, APPROVED, REJECTED, HIDDEN.
- moderatedById.
- moderatedAt.
- createdAt.
- updatedAt.

Relationships:

- Review belongs to one product.
- Review belongs to one customer.
- Review should be linked to a completed order for purchase verification.

### RevenueRecord

Key fields:

- id.
- sourceType: ADVERTISING, AFFILIATE, PRODUCT_SALE.
- campaignId nullable.
- brandId nullable.
- orderId nullable.
- amount.
- costAmount.
- profitAmount.
- occurredAt.
- notes.

Relationships:

- Revenue records roll up campaign, brand, and sales reports.

### NotificationLog

Key fields:

- id.
- userId nullable.
- type: REMINDER, ORDER_STATUS, PASSWORD_RESET, SYSTEM.
- channel: IN_APP, EMAIL_MOCK, SMS_MOCK.
- subject.
- body.
- status: QUEUED, SENT, FAILED.
- scheduledAt.
- sentAt.
- createdAt.

## 7. Representative API Endpoints

All protected endpoints require JWT authentication. Admin and Staff endpoints require role checks.

### Auth and Profile

- `POST /auth/register` - Customer registration.
- `POST /auth/login` - Login for Admin, Staff, and Customer.
- `POST /auth/refresh` - Refresh access token.
- `POST /auth/logout` - Revoke refresh token.
- `POST /auth/password/forgot` - Start mock password reset flow.
- `POST /auth/password/reset` - Reset password.
- `GET /me` - Get current user profile.
- `PATCH /me` - Update current user profile.

### Admin: User Management

- `GET /admin/users` - List users with filters by role and status.
- `POST /admin/users` - Create Admin or Staff user.
- `GET /admin/users/:id` - View user details.
- `PATCH /admin/users/:id` - Update user profile fields.
- `PATCH /admin/users/:id/role` - Change user role.
- `PATCH /admin/users/:id/status` - Activate, deactivate, or suspend user.

### Admin: System Settings

- `GET /admin/settings` - View system settings.
- `PATCH /admin/settings` - Update system settings.

### Admin: Brands and Campaigns

- `GET /admin/brands` - List brands.
- `POST /admin/brands` - Create brand.
- `GET /admin/brands/:id` - View brand details.
- `PATCH /admin/brands/:id` - Update brand.
- `PATCH /admin/brands/:id/status` - Change brand status.
- `GET /admin/campaigns` - List campaigns with filters.
- `POST /admin/campaigns` - Create campaign.
- `GET /admin/campaigns/:id` - View campaign detail.
- `PATCH /admin/campaigns/:id` - Update campaign.
- `PATCH /admin/campaigns/:id/status` - Change campaign status.
- `GET /admin/campaigns/:id/milestones` - List campaign milestones.
- `POST /admin/campaigns/:id/milestones` - Create milestone.
- `PATCH /admin/milestones/:id` - Update milestone.
- `PATCH /admin/milestones/:id/status` - Mark milestone done, pending, or cancelled.

### Admin: Content, Affiliate Links, and Social Publishing

- `GET /admin/articles` - List articles.
- `POST /admin/articles` - Create article.
- `GET /admin/articles/:id` - View article.
- `PATCH /admin/articles/:id` - Update article.
- `PATCH /admin/articles/:id/publish` - Publish article.
- `PATCH /admin/articles/:id/archive` - Archive article.
- `GET /admin/affiliate-links` - List affiliate links.
- `POST /admin/affiliate-links` - Create affiliate link.
- `PATCH /admin/affiliate-links/:id` - Update affiliate link.
- `PATCH /admin/affiliate-links/:id/status` - Activate or deactivate affiliate link.
- `POST /admin/articles/:id/social-posts` - Queue mock social post for Facebook or TikTok.
- `GET /admin/social-posts` - List queued, posted, and failed social posts.
- `POST /admin/social-posts/:id/retry` - Retry failed mock social post.
- `POST /admin/social-metrics` - Enter manual social metrics.

### Public Content and Affiliate Redirects

- `GET /articles` - List published articles.
- `GET /articles/:slug` - View published article.
- `GET /r/:trackingCode` - Track affiliate click and redirect to destination URL.

### Staff: Products

- `GET /staff/products` - List products with filters.
- `POST /staff/products` - Create product.
- `GET /staff/products/:id` - View product detail.
- `PATCH /staff/products/:id` - Update product.
- `PATCH /staff/products/:id/status` - Change product status.
- `POST /staff/products/:id/images` - Add product image.
- `PATCH /staff/product-images/:id` - Update image metadata.
- `DELETE /staff/product-images/:id` - Remove product image.
- `GET /staff/categories` - List categories.
- `POST /staff/categories` - Create category.
- `PATCH /staff/categories/:id` - Update category.

### Public and Customer: Products

- `GET /products` - Public product listing with search and filters.
- `GET /products/:slug` - Public product details.
- `GET /products/:slug/reviews` - Public approved reviews.

### Customer: Cart and Checkout

- `GET /cart` - View active cart.
- `POST /cart/items` - Add product to cart.
- `PATCH /cart/items/:id` - Update cart item quantity.
- `DELETE /cart/items/:id` - Remove item from cart.
- `POST /checkout` - Create order from cart using mock payment provider.
- `GET /orders` - View own orders.
- `GET /orders/:id` - View own order detail.
- `POST /orders/:id/cancel` - Cancel own eligible order.

### Staff: Orders and Reviews

- `GET /staff/orders` - List orders with filters.
- `GET /staff/orders/:id` - View order detail.
- `PATCH /staff/orders/:id/status` - Update order status.
- `PATCH /staff/orders/:id/notes` - Update fulfillment notes.
- `GET /staff/reviews` - List reviews for moderation.
- `PATCH /staff/reviews/:id/status` - Approve, reject, or hide review.

### Customer: Reviews

- `POST /products/:id/reviews` - Create review for purchased product.
- `GET /me/reviews` - List own reviews.
- `PATCH /me/reviews/:id` - Edit own pending review.
- `DELETE /me/reviews/:id` - Delete own pending review.

### Reports and Dashboards

- `GET /admin/reports/revenue` - Admin revenue report by date range and source.
- `GET /admin/reports/campaigns` - Campaign KPI report.
- `GET /admin/reports/affiliate-links` - Affiliate click and CTR report.
- `GET /admin/reports/orders` - Order statistics report.
- `GET /staff/reports/orders` - Staff order operations report.
- `GET /reports/:reportType/export.csv` - Export authorized report as CSV.

## 8. Non-Functional Requirements

### Security

- Enforce RBAC at API controller and service levels.
- Hash passwords with bcrypt or Argon2.
- Store refresh tokens hashed.
- Validate all request bodies with DTO schemas.
- Never expose password hashes, reset tokens, or internal provider credentials.
- Use rate limiting for login, password reset, checkout, and affiliate redirect endpoints.

### Data Validation

- Unique constraints for user email, product slug, article slug, brand slug, and affiliate tracking code.
- Product price, cost price, and stock quantities must be non-negative.
- Order status transitions must be validated.
- Customers can review a product only after a completed or delivered order containing that product.
- Campaign dates must be valid: endDate cannot be before startDate.

### Responsiveness and UX

- Admin and Staff dashboard pages must support desktop-first workflows and remain usable on tablet widths.
- Customer storefront, cart, checkout, account, and order pages must be responsive on common mobile, tablet, and desktop web viewports.
- Public web pages must be responsive.
- Tables must include search, filtering, pagination, and empty states.
- Forms must show field-level validation errors.

### Performance

- Use pagination for list endpoints.
- Add database indexes for user email, slugs, order status, campaign status, brandId, productId, createdAt, and date-range report queries.
- Dashboard endpoints should aggregate server-side.
- Report exports should run as background jobs if large.

### Auditability

- Store createdById and updatedById for admin/staff-managed records where practical.
- Store status history or updatedAt timestamps for campaigns, orders, articles, and reviews.
- Record affiliate clicks before redirecting.

### Seed Data

Provide seed data for:

- Admin user.
- Staff user.
- Customer users.
- Beauty brands.
- Product categories.
- Products with images.
- Collaboration campaigns across all collaboration types.
- Articles with affiliate links.
- Social metrics sample data.
- Orders in multiple statuses.
- Product reviews.

### Testing

- Unit tests for auth, RBAC, order status transitions, affiliate redirect tracking, and campaign KPI aggregation.
- API integration tests for auth, product listing, checkout, order management, review moderation, and reports.
- Web smoke tests for admin login, product CRUD, order status update, and dashboard load.

### Observability

- Structured API logging.
- Request IDs for API requests.
- Error logs for failed background jobs.
- Basic health endpoints for API, database, and Redis.

## 9. Phased Build Order

### Phase 1: Foundation

1. Set up monorepo, linting, formatting, environment files, Docker Compose, PostgreSQL, Redis, and Prisma.
2. Create database schema and migrations for users, roles, brands, products, campaigns, orders, reviews, and reports.
3. Implement NestJS app structure, config module, database module, auth module, and OpenAPI documentation.
4. Implement authentication, JWT refresh flow, RBAC guards, seed users, and protected route tests.
5. Scaffold Next.js web app with public routes, authenticated layout, role-aware navigation, login, Admin dashboard routes, Staff routes, and Customer account routes.
6. Build a shared API client, auth state handling, route guards, and reusable UI components for the web app.

### Phase 2: Core Admin and Staff Operations

1. Implement Admin user management.
2. Implement brand CRUD.
3. Implement campaign CRUD, collaboration types, campaign statuses, milestones, and internal reminders.
4. Implement product category and product CRUD for Staff.
5. Implement image upload adapter using local storage.
6. Implement order data model and staff order management screens.

### Phase 3: Customer Commerce

1. Implement public product listing and product detail APIs.
2. Build customer web product browsing and product detail screens.
3. Implement cart APIs and web cart screens.
4. Implement mock checkout and order creation.
5. Implement customer order history and order detail screens.
6. Implement inventory deduction and order status transition validation.

### Phase 4: Content, Affiliate, and Collaboration Revenue

1. Implement advertising article CRUD and publish flow.
2. Implement public article listing and article detail.
3. Implement affiliate link CRUD.
4. Implement affiliate redirect endpoint and click tracking.
5. Link articles, campaigns, brands, products, and affiliate links.
6. Implement revenue records for advertising fees, affiliate commissions, and product sales.

### Phase 5: Reviews, Reports, and Dashboards

1. Implement customer product reviews with purchase verification.
2. Implement staff review moderation.
3. Implement admin revenue report APIs.
4. Implement staff order statistics.
5. Implement campaign KPI dashboard using internal and manually entered social metrics.
6. Implement CSV export.

### Phase 6: Integration Stubs and Polish

1. Implement mock Facebook and TikTok social publishing providers.
2. Implement social post queue and retry behavior.
3. Implement manual social metric entry.
4. Implement notification log and mock email/SMS sender.
5. Implement ICS export for campaign milestones.
6. Add final seed data, loading states, empty states, error states, and smoke tests.
7. Prepare installation guide and user manual.

## 10. Open Questions / Assumptions Made

- The source document mentions a web app for Admin/Staff and a mobile app for Customers. Per the latest instruction, this spec assumes v1 is webapp-only: Admin, Staff, Customer, and Guest experiences are all implemented in one responsive web application.
- The source document mentions ASP.NET Core API and Firebase as possible technologies, but also allows other suitable technologies. This spec recommends NestJS, PostgreSQL, and Prisma as the best fit for a modern TypeScript monorepo.
- The source document does not define payment methods. This spec assumes mock payment in v1 and leaves real payment gateway selection for later.
- The source document does not define shipping or delivery providers. This spec assumes manual staff-controlled fulfillment in v1.
- The source document asks for Facebook/TikTok APIs, but real API approval and credentials can be slow. This spec treats real social posting and metric import as v1 non-goals and implements provider interfaces with mocks.
- The source document mentions connecting with a calendar. This spec assumes internal reminders plus ICS export for v1 instead of full Google Calendar integration.
- The source document does not specify whether Staff can create brands or campaigns. This spec limits brand/campaign management to Admin and product/order operations to Staff.
- The source document does not specify whether guest users can buy products. This spec requires customer registration/login before checkout to simplify order history and review verification.
- The source document does not define tax, discounts, vouchers, or shipping fee rules. This spec includes basic shippingFee and discountTotal fields but does not require promotion logic in v1.
- The source document does not define exact report chart types. This spec requires dashboard-ready aggregate endpoints and leaves chart selection to the UI implementation.
