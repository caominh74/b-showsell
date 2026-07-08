import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

const orderInclude = {
  items: { include: { product: { include: { images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] } } } } },
  customer: { select: { id: true, email: true, fullName: true, phone: true } },
} satisfies Prisma.OrderInclude;

@Injectable()
export class CommerceService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(customerId: string) {
    const cart = await this.getOrCreateCart(customerId);
    return this.hydrateCart(cart.id);
  }

  async addCartItem(customerId: string, dto: AddCartItemDto) {
    const cart = await this.getOrCreateCart(customerId);
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, status: 'ACTIVE' },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.stockQuantity < dto.quantity) {
      throw new BadRequestException('Requested quantity exceeds available stock');
    }

    const unitPriceSnapshot = product.salePrice ?? product.price;
    const existing = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: product.id },
    });

    if (existing) {
      const quantity = existing.quantity + dto.quantity;
      if (product.stockQuantity < quantity) {
        throw new BadRequestException('Requested quantity exceeds available stock');
      }
      await this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity, unitPriceSnapshot },
      });
    } else {
      await this.prisma.cartItem.create({
        data: { cartId: cart.id, productId: product.id, quantity: dto.quantity, unitPriceSnapshot },
      });
    }

    return this.hydrateCart(cart.id);
  }

  async updateCartItem(customerId: string, itemId: string, dto: UpdateCartItemDto) {
    const item = await this.findOwnedCartItem(customerId, itemId);
    if (dto.quantity === 0) {
      await this.prisma.cartItem.delete({ where: { id: item.id } });
      return this.hydrateCart(item.cartId);
    }

    if (item.product.stockQuantity < dto.quantity) {
      throw new BadRequestException('Requested quantity exceeds available stock');
    }

    await this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: dto.quantity, unitPriceSnapshot: item.product.salePrice ?? item.product.price },
    });
    return this.hydrateCart(item.cartId);
  }

  async removeCartItem(customerId: string, itemId: string) {
    const item = await this.findOwnedCartItem(customerId, itemId);
    await this.prisma.cartItem.delete({ where: { id: item.id } });
    return this.hydrateCart(item.cartId);
  }

  async checkout(customerId: string, dto: CheckoutDto) {
    const cart = await this.getOrCreateCart(customerId);
    const hydrated = await this.hydrateCart(cart.id);
    if (!hydrated.items.length) {
      throw new BadRequestException('Cart is empty');
    }

    const paymentStatus = dto.mockPaymentStatus ?? 'MOCK_PAID';
    const paid = paymentStatus === 'MOCK_PAID';
    const orderStatus: OrderStatus = paid ? 'PAID' : 'PENDING_PAYMENT';
    const subtotal = hydrated.items.reduce((sum, item) => sum + (item.unitPriceSnapshot ?? 0) * item.quantity, 0);
    const shippingFee = subtotal > 500000 ? 0 : 30000;
    const total = subtotal + shippingFee;

    return this.prisma.$transaction(async (tx) => {
      for (const item of hydrated.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product || product.status !== 'ACTIVE') {
          throw new BadRequestException(`${item.product.name} is no longer available`);
        }
        if (product.stockQuantity < item.quantity) {
          throw new BadRequestException(`${product.name} does not have enough stock`);
        }
      }

      const order = await tx.order.create({
        data: {
          orderNumber: await this.nextOrderNumber(tx),
          customerId,
          status: orderStatus,
          paymentStatus,
          subtotal,
          shippingFee,
          discountTotal: 0,
          total,
          recipientName: dto.recipientName,
          recipientPhone: dto.recipientPhone,
          shippingAddressLine1: dto.shippingAddressLine1,
          shippingAddressLine2: dto.shippingAddressLine2,
          ward: dto.ward,
          district: dto.district,
          city: dto.city,
          notes: dto.notes,
          items: {
            create: hydrated.items.map((item) => ({
              productId: item.productId,
              productNameSnapshot: item.product.name,
              unitPriceSnapshot: item.unitPriceSnapshot ?? item.product.price,
              quantity: item.quantity,
              lineTotal: (item.unitPriceSnapshot ?? item.product.price) * item.quantity,
            })),
          },
        },
        include: orderInclude,
      });

      if (paid) {
        for (const item of hydrated.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: { decrement: item.quantity },
              status: item.product.stockQuantity - item.quantity <= 0 ? 'OUT_OF_STOCK' : undefined,
            },
          });
        }
      }

      await tx.cart.update({ where: { id: cart.id }, data: { status: 'CONVERTED' } });
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return order;
    });
  }

  listOrders(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      include: orderInclude,
      orderBy: { placedAt: 'desc' },
    });
  }

  async findOrder(customerId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId }, include: orderInclude });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.customerId !== customerId) {
      throw new ForbiddenException('Cannot access this order');
    }
    return order;
  }

  async cancelOrder(customerId: string, orderId: string) {
    const order = await this.findOrder(customerId, orderId);
    if (order.status !== 'PENDING_PAYMENT') {
      throw new BadRequestException('Only pending payment orders can be cancelled by the customer');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
      include: orderInclude,
    });
  }

  private async getOrCreateCart(customerId: string) {
    const existing = await this.prisma.cart.findFirst({
      where: { customerId, status: 'ACTIVE' },
      orderBy: { updatedAt: 'desc' },
    });
    if (existing) {
      return existing;
    }
    return this.prisma.cart.create({ data: { customerId, status: 'ACTIVE' } });
  }

  private async hydrateCart(cartId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: { include: { brand: true, images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] } } },
          },
          orderBy: { id: 'asc' },
        },
      },
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return {
      ...cart,
      subtotal: cart.items.reduce((sum, item) => sum + (item.unitPriceSnapshot ?? item.product.price) * item.quantity, 0),
    };
  }

  private async findOwnedCartItem(customerId: string, itemId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true, product: true },
    });
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }
    if (item.cart.customerId !== customerId || item.cart.status !== 'ACTIVE') {
      throw new ForbiddenException('Cannot update this cart item');
    }
    return item;
  }

  private async nextOrderNumber(tx: Prisma.TransactionClient) {
    const count = await tx.order.count();
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `BS-${date}-${String(count + 1).padStart(5, '0')}`;
  }
}
