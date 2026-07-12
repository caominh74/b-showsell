import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';
import { UpdateOwnReviewDto } from './dto/update-own-review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('reviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Roles(Role.CUSTOMER)
  @Post('products/:id/reviews')
  create(@CurrentUser('id') customerId: string, @Param('id') productId: string, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(customerId, productId, dto);
  }

  @Roles(Role.CUSTOMER)
  @Get('me/reviews')
  listOwn(@CurrentUser('id') customerId: string) {
    return this.reviewsService.listOwn(customerId);
  }

  @Roles(Role.CUSTOMER)
  @Patch('me/reviews/:id')
  updateOwn(@CurrentUser('id') customerId: string, @Param('id') id: string, @Body() dto: UpdateOwnReviewDto) {
    return this.reviewsService.updateOwn(customerId, id, dto);
  }

  @Roles(Role.CUSTOMER)
  @Delete('me/reviews/:id')
  deleteOwn(@CurrentUser('id') customerId: string, @Param('id') id: string) {
    return this.reviewsService.deleteOwn(customerId, id);
  }

  @Roles(Role.STAFF)
  @Get('staff/reviews')
  listForModeration(@Query('status') status?: string) {
    return this.reviewsService.listForModeration(status);
  }

  @Roles(Role.STAFF)
  @Patch('staff/reviews/:id/status')
  moderate(@Param('id') id: string, @Body() dto: ModerateReviewDto, @CurrentUser('id') moderatorId: string) {
    return this.reviewsService.moderate(id, dto, moderatorId);
  }
}
