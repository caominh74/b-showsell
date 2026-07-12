# B-ShowSell To-Do V2: Source Document Alignment and Submission Readiness

This checklist captures items found in the original capstone registration document that were missing or not explicit enough in `docs/spec.md`. These are documentation, packaging, and optional future-scope tasks rather than the already completed application feature phases.

## Phase 7: Academic Documentation

- [ ] Create a source traceability matrix mapping the original `.docx` requirements to implemented features and `docs/spec.md` sections.
- [ ] Prepare a User Requirements document covering Admin, Staff, Customer, and Guest goals.
- [ ] Prepare a Software Requirement Specification document based on the current `docs/spec.md`.
- [ ] Create UML 2.0 use case diagrams for Admin, Staff, Customer, and Guest workflows.
- [ ] Create UML 2.0 domain/class diagrams for users, brands, campaigns, content, affiliate links, products, orders, reviews, reports, and notifications.
- [ ] Create UML 2.0 sequence diagrams for login, checkout, article publishing, affiliate redirect tracking, review moderation, and report export.
- [ ] Create UML 2.0 activity diagrams for checkout, order fulfillment, campaign management, and content publishing.
- [ ] Create deployment and architecture diagrams for the Next.js web app, NestJS API, PostgreSQL database, Redis/job stubs, and local deployment topology.

## Phase 8: Design and Testing Documents

- [ ] Prepare an Architecture Design document describing frontend, backend, database, authentication, authorization, integrations, and deployment boundaries.
- [ ] Prepare a Detail Design document covering key modules, DTOs, controllers, services, Prisma models, and page routes.
- [ ] Prepare a System Implementation document summarizing completed modules, important implementation decisions, and known limitations.
- [ ] Prepare a Testing Document with test scope, test cases, expected results, actual results, and evidence from API/web build verification.
- [ ] Add screenshots or exported evidence for admin, staff, customer, public article, product, cart, order, review, and report flows.
- [ ] Add a known limitations section for mocked payment, mocked social posting, mocked notifications, manual shipping, and web-only customer experience.

## Phase 9: Packaging and Submission

- [ ] Prepare a source code package with clear folder structure and setup notes.
- [ ] Prepare a deployable software package or deployment instructions for the local/staging environment.
- [ ] Verify installation instructions from a clean checkout.
- [ ] Verify seed data supports a complete demo flow for Admin, Staff, Customer, and Guest.
- [ ] Prepare a viva/demo checklist so each team member can explain requirements, design, implementation, testing, and limitations.
- [ ] Prepare role-based demo scripts for Admin, Staff, Customer, and Guest.

## Future Scope Considerations

- [ ] Decide whether the original customer mobile-app expectation should become a future native/hybrid mobile app phase.
- [ ] Decide whether real Facebook and TikTok API posting should replace the current mock provider.
- [ ] Decide whether real social metric imports should replace manual metric entry.
- [ ] Decide whether real Shopee/Lazada integration should replace simple affiliate redirects.
- [ ] Decide whether real payment, shipping, email, SMS, and calendar providers are required after V1.
