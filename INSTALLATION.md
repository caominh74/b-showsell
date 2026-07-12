# B-ShowSell Installation Guide

## Prerequisites

- Node.js 18 or newer.
- npm 11 or newer.
- PostgreSQL database reachable from `apps/api/.env`.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure API environment in `apps/api/.env`.

Set `DATABASE_URL` and JWT settings for your local database and auth secrets.

3. Generate Prisma client:

```bash
npm exec prisma generate -- --schema apps/api/prisma/schema.prisma
```

4. Apply database migrations or push the schema for local development:

```bash
npm exec prisma db push -- --schema apps/api/prisma/schema.prisma
```

5. Seed sample data:

```bash
npm run --workspace api prisma:seed
```

If the workspace script is unavailable, run:

```bash
cd apps/api
npm exec ts-node prisma/seed.ts
```

## Development

Run both apps:

```bash
npm run dev
```

Default ports:

- API: `http://localhost:3001`
- Swagger docs: `http://localhost:3001/api/docs`
- Web: `http://localhost:3000`

## Verification

```bash
npm run build --workspace api
npm run build --workspace web
```
