import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateOrderNotesDto } from './dto/update-order-notes.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ['PAID', 'CANCELLED'],
  PAID: ['PROCESSING', 'CANCELLED', 'REFUNDED'],
  PROCESSING: ['SHIPPED', 'CANCELLED', 'REFUNDED'],
  SHIPPED: ['DELIVERED', 'REFUNDED'],
  DELIVERED: ['REFUNDED'],
  CANCELLED: [],
  REFUNDED: [],
};

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  list(status?: string) {
    return this.prisma.order.findMany({
      where: { status: status as never },
      include: {
        customer: { select: { id: true, fullName: true, email: true, phone: true } },
        items: { include: { product: { select: { id: true, name: true, slug: true } } } },
      },
      orderBy: { placedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, fullName: true, email: true, phone: true } },
        items: { include: { product: { select: { id: true, name: true, slug: true } } } },
      },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.findOne(id);
    if (order.status !== dto.status && !allowedTransitions[order.status].includes(dto.status)) {
      throw new BadRequestException(`Cannot change order from ${order.status} to ${dto.status}`);
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: dto.status,
        paymentStatus: dto.paymentStatus ?? this.inferPaymentStatus(dto.status),
      },
      include: { customer: true, items: true },
    });
  }

  updateNotes(id: string, dto: UpdateOrderNotesDto) {
    return this.prisma.order.update({
      where: { id },
      data: { notes: dto.notes },
    });
  }

  private inferPaymentStatus(status: OrderStatus) {
    if (status === 'PAID' || status === 'PROCESSING' || status === 'SHIPPED' || status === 'DELIVERED') {
      return 'MOCK_PAID';
    }
    if (status === 'REFUNDED') {
      return 'MOCK_REFUNDED';
    }
    return undefined;
  }
}
