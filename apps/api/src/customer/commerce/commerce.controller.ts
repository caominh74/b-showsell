import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CommerceService } from './commerce.service';

@ApiTags('customer commerce')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.CUSTOMER)
@Controller()
export class CommerceController {
  constructor(private readonly commerceService: CommerceService) {}

  @Get('cart')
  getCart(@CurrentUser('id') customerId: string) {
    return this.commerceService.getCart(customerId);
  }

  @Post('cart/items')
  addCartItem(@CurrentUser('id') customerId: string, @Body() dto: AddCartItemDto) {
    return this.commerceService.addCartItem(customerId, dto);
  }

  @Patch('cart/items/:id')
  updateCartItem(@CurrentUser('id') customerId: string, @Param('id') id: string, @Body() dto: UpdateCartItemDto) {
    return this.commerceService.updateCartItem(customerId, id, dto);
  }

  @Delete('cart/items/:id')
  removeCartItem(@CurrentUser('id') customerId: string, @Param('id') id: string) {
    return this.commerceService.removeCartItem(customerId, id);
  }

  @Post('checkout')
  checkout(@CurrentUser('id') customerId: string, @Body() dto: CheckoutDto) {
    return this.commerceService.checkout(customerId, dto);
  }

  @Get('orders')
  listOrders(@CurrentUser('id') customerId: string) {
    return this.commerceService.listOrders(customerId);
  }

  @Get('orders/:id')
  findOrder(@CurrentUser('id') customerId: string, @Param('id') id: string) {
    return this.commerceService.findOrder(customerId, id);
  }

  @Post('orders/:id/cancel')
  cancelOrder(@CurrentUser('id') customerId: string, @Param('id') id: string) {
    return this.commerceService.cancelOrder(customerId, id);
  }
}
