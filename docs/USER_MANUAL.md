# B-ShowSell User Manual

## Admin

Admins manage users, brands, campaigns, articles, affiliate links, social metrics, notifications, and reports.

- Sign in at `/login`.
- Use `/admin/users` to create internal users and manage roles.
- Use `/admin/brands` and `/admin/campaigns` to prepare collaboration work.
- Use `/admin/content` to create article drafts. Publish through the article API when content is ready.
- Use `/admin/reports` to review revenue and campaign KPI summaries.
- Export revenue CSV files from the Reports page.

## Staff

Staff users manage product catalog operations, order fulfillment, and review moderation.

- Use `/staff/products` to create products, categories, and product images.
- Use `/staff/orders` to update fulfillment status and notes.
- Use `/staff/reviews` to approve, reject, or hide customer product reviews.
- Use `/staff/reports/orders` through the API for operational order statistics.

## Customers

Customers browse products, manage their cart, checkout with mock payment, view orders, and review delivered purchases.

- Browse products from `/products`.
- Add active products to the cart and checkout from `/account/cart`.
- Track order history from `/account/orders`.
- Create product reviews only after an order containing that product is delivered.

## Public Visitors

Guests can browse active products and published articles.

- Product catalog: `/products`
- Published articles: `/articles`
- Affiliate links redirect through `/r/:trackingCode` so clicks are recorded before external navigation.
