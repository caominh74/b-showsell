import 'dotenv/config';
import { PrismaClient, Role, UserStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required to seed the database');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const saltRounds = 10;
  const adminPasswordHash = await bcrypt.hash('admin123', saltRounds);
  const staffPasswordHash = await bcrypt.hash('staff123', saltRounds);
  const customerPasswordHash = await bcrypt.hash('customer123', saltRounds);

  console.log('Seeding database...');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@beautyblogger.com' },
    update: {},
    create: {
      email: 'admin@beautyblogger.com',
      passwordHash: adminPasswordHash,
      fullName: 'System Admin',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@beautyblogger.com' },
    update: {},
    create: {
      email: 'staff@beautyblogger.com',
      passwordHash: staffPasswordHash,
      fullName: 'Store Staff',
      role: Role.STAFF,
      status: UserStatus.ACTIVE,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      passwordHash: customerPasswordHash,
      fullName: 'Jane Customer',
      role: Role.CUSTOMER,
      status: UserStatus.ACTIVE,
    },
  });

  console.log({ admin, staff, customer });
  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
