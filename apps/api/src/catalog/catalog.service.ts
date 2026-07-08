import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  listProducts(query?: string, categoryId?: string, brandId?: string) {
    return this.prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        categoryId,
        brandId,
        OR: query
          ? [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { ingredients: { contains: query, mode: 'insensitive' } },
            ]
          : undefined,
      },
      include: {
        brand: true,
        category: true,
        images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
        reviews: { where: { status: 'APPROVED' }, select: { rating: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, status: 'ACTIVE' },
      include: {
        brand: true,
        category: true,
        images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
        affiliateLinks: { where: { status: 'ACTIVE' } },
        reviews: {
          where: { status: 'APPROVED' },
          include: { customer: { select: { id: true, fullName: true, avatarUrl: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async listReviews(slug: string) {
    const product = await this.prisma.product.findFirst({ where: { slug, status: 'ACTIVE' } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.productReview.findMany({
      where: { productId: product.id, status: 'APPROVED' },
      include: { customer: { select: { id: true, fullName: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
