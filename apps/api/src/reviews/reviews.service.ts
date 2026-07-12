import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';
import { UpdateOwnReviewDto } from './dto/update-own-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(customerId: string, productId: string, dto: CreateReviewDto) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: dto.orderId,
        customerId,
        status: 'DELIVERED',
        items: { some: { productId } },
      },
    });
    if (!order) {
      throw new BadRequestException('Reviews require a delivered order containing this product');
    }

    const existing = await this.prisma.productReview.findFirst({
      where: { customerId, productId, orderId: dto.orderId },
    });
    if (existing) {
      throw new BadRequestException('This product has already been reviewed for the selected order');
    }

    return this.prisma.productReview.create({
      data: {
        customerId,
        productId,
        orderId: dto.orderId,
        rating: dto.rating,
        title: dto.title,
        body: dto.body,
        status: 'PENDING',
      },
      include: { product: true, order: true },
    });
  }

  listOwn(customerId: string) {
    return this.prisma.productReview.findMany({
      where: { customerId },
      include: { product: { include: { images: true } }, order: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOwn(customerId: string, id: string, dto: UpdateOwnReviewDto) {
    const review = await this.findOwnPending(customerId, id);
    return this.prisma.productReview.update({ where: { id: review.id }, data: dto });
  }

  async deleteOwn(customerId: string, id: string) {
    const review = await this.findOwnPending(customerId, id);
    await this.prisma.productReview.delete({ where: { id: review.id } });
    return { deleted: true };
  }

  listForModeration(status?: string) {
    return this.prisma.productReview.findMany({
      where: { status: status as never },
      include: {
        product: true,
        customer: { select: { id: true, fullName: true, email: true } },
        order: { select: { id: true, orderNumber: true, status: true } },
        moderatedBy: { select: { id: true, fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async moderate(id: string, dto: ModerateReviewDto, moderatorId: string) {
    const review = await this.prisma.productReview.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (dto.status === 'PENDING') {
      throw new BadRequestException('Moderation status must approve, reject, or hide the review');
    }
    return this.prisma.productReview.update({
      where: { id },
      data: { status: dto.status, moderatedById: moderatorId, moderatedAt: new Date() },
    });
  }

  private async findOwnPending(customerId: string, id: string) {
    const review = await this.prisma.productReview.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (review.customerId !== customerId) {
      throw new ForbiddenException('Cannot update this review');
    }
    if (review.status !== 'PENDING') {
      throw new BadRequestException('Only pending reviews can be changed');
    }
    return review;
  }
}
