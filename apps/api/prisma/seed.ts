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

  const glowLab = await prisma.brand.upsert({
    where: { slug: 'glow-lab-vietnam' },
    update: {},
    create: {
      name: 'Glow Lab Vietnam',
      slug: 'glow-lab-vietnam',
      description: 'Local skincare brand focused on humid-weather routines.',
      contactName: 'Linh Tran',
      contactEmail: 'linh@glowlab.vn',
      websiteUrl: 'https://example.com/glow-lab',
      defaultCommissionRate: 25000,
    },
  });

  const category = await prisma.productCategory.upsert({
    where: { slug: 'serums' },
    update: {},
    create: {
      name: 'Serums',
      slug: 'serums',
      description: 'Lightweight treatment products for daily routines.',
    },
  });

  const serum = await prisma.product.upsert({
    where: { slug: 'glow-lab-niacinamide-serum' },
    update: {},
    create: {
      brandId: glowLab.id,
      categoryId: category.id,
      name: 'Glow Lab Niacinamide Serum',
      slug: 'glow-lab-niacinamide-serum',
      description: 'A balancing serum for bright, oil-controlled skin.',
      ingredients: 'Niacinamide, zinc PCA, panthenol',
      usageInstructions: 'Apply after cleansing and before moisturizer.',
      price: 320000,
      salePrice: 289000,
      costPrice: 160000,
      stockQuantity: 50,
      status: 'ACTIVE',
      images: {
        create: {
          url: '/uploads/sample-serum.jpg',
          altText: 'Glow Lab serum bottle',
          isPrimary: true,
        },
      },
    },
  });

  const campaign = await prisma.campaign.upsert({
    where: { id: 'seed-glow-campaign' },
    update: {},
    create: {
      id: 'seed-glow-campaign',
      brandId: glowLab.id,
      name: 'Summer Glow Launch',
      description: 'Website, Facebook, and TikTok launch campaign for the serum.',
      collaborationType: 'ADVERTISING',
      status: 'IN_PROGRESS',
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      advertisingFee: 5000000,
      expectedCommissionRate: 25000,
      createdById: admin.id,
      milestones: {
        create: {
          title: 'Publish campaign article',
          dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          reminderAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6),
          assignedToId: staff.id,
        },
      },
    },
  });

  const article = await prisma.contentArticle.upsert({
    where: { slug: 'summer-glow-serum-routine' },
    update: {},
    create: {
      campaignId: campaign.id,
      brandId: glowLab.id,
      title: 'Summer Glow Serum Routine',
      slug: 'summer-glow-serum-routine',
      excerpt: 'How to layer a lightweight brightening serum in hot, humid weather.',
      bodyMarkdown:
        'Start with a gentle cleanse, press a few drops of serum into damp skin, then seal with gel moisturizer and sunscreen in the morning.',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: admin.id,
    },
  });

  await prisma.affiliateLink.upsert({
    where: { trackingCode: 'glow-serum-web' },
    update: {},
    create: {
      campaignId: campaign.id,
      brandId: glowLab.id,
      productId: serum.id,
      articleId: article.id,
      label: 'Shop Glow Lab Serum',
      destinationUrl: 'https://example.com/shop/glow-serum',
      trackingCode: 'glow-serum-web',
      channel: 'WEBSITE',
      commissionRate: 25000,
    },
  });

  const existingMetric = await prisma.socialMetric.findFirst({ where: { campaignId: campaign.id, source: 'SEEDED' } });
  if (!existingMetric) {
    await prisma.socialMetric.create({
      data: {
        campaignId: campaign.id,
        platform: 'WEBSITE',
        reach: 1200,
        impressions: 1800,
        likes: 140,
        comments: 12,
        shares: 8,
        clicks: 96,
        ctr: 96 / 1800,
        source: 'SEEDED',
      },
    });
  }

  const order = await prisma.order.upsert({
    where: { orderNumber: 'BS-SEED-00001' },
    update: {},
    create: {
      orderNumber: 'BS-SEED-00001',
      customerId: customer.id,
      status: 'DELIVERED',
      paymentStatus: 'MOCK_PAID',
      subtotal: 289000,
      shippingFee: 30000,
      total: 319000,
      recipientName: customer.fullName,
      recipientPhone: '0900000000',
      shippingAddressLine1: '1 Nguyen Hue',
      city: 'Ho Chi Minh City',
      items: {
        create: {
          productId: serum.id,
          productNameSnapshot: serum.name,
          unitPriceSnapshot: 289000,
          quantity: 1,
          lineTotal: 289000,
        },
      },
    },
  });

  const existingReview = await prisma.productReview.findFirst({
    where: { productId: serum.id, customerId: customer.id, orderId: order.id },
  });
  if (!existingReview) {
    await prisma.productReview.create({
      data: {
        productId: serum.id,
        customerId: customer.id,
        orderId: order.id,
        rating: 5,
        title: 'Light and easy to layer',
        body: 'Works well under sunscreen and does not feel sticky.',
        status: 'APPROVED',
        moderatedById: staff.id,
        moderatedAt: new Date(),
      },
    });
  }

  const existingRevenue = await prisma.revenueRecord.findFirst({ where: { sourceType: 'PRODUCT_SALE', orderId: order.id } });
  if (!existingRevenue) {
    await prisma.revenueRecord.create({
      data: {
        sourceType: 'PRODUCT_SALE',
        brandId: glowLab.id,
        orderId: order.id,
        amount: order.total,
        costAmount: 160000,
        profitAmount: order.total - 160000,
        notes: 'Seed delivered order revenue.',
      },
    });
  }

  console.log({ admin, staff, customer, glowLab, category, serum, campaign, article, order });
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
