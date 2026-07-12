import { Body, Controller, Get, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import type { Request, Response } from 'express';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ContentService } from './content.service';
import { CreateAffiliateLinkDto } from './dto/create-affiliate-link.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { CreateSocialMetricDto } from './dto/create-social-metric.dto';
import { QueueSocialPostDto } from './dto/queue-social-post.dto';
import { UpdateAffiliateLinkDto } from './dto/update-affiliate-link.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('content and affiliate')
@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/articles')
  listArticles(@Query('status') status?: string) {
    return this.contentService.listArticles(status);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('admin/articles')
  createArticle(@Body() dto: CreateArticleDto, @CurrentUser('id') userId: string) {
    return this.contentService.createArticle(dto, userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/articles/:id')
  findArticle(@Param('id') id: string) {
    return this.contentService.findArticle(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('admin/articles/:id')
  updateArticle(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.contentService.updateArticle(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('admin/articles/:id/publish')
  publishArticle(@Param('id') id: string) {
    return this.contentService.publishArticle(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('admin/articles/:id/archive')
  archiveArticle(@Param('id') id: string) {
    return this.contentService.archiveArticle(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/affiliate-links')
  listAffiliateLinks() {
    return this.contentService.listAffiliateLinks();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('admin/affiliate-links')
  createAffiliateLink(@Body() dto: CreateAffiliateLinkDto) {
    return this.contentService.createAffiliateLink(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('admin/affiliate-links/:id')
  updateAffiliateLink(@Param('id') id: string, @Body() dto: UpdateAffiliateLinkDto) {
    return this.contentService.updateAffiliateLink(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('admin/affiliate-links/:id/status')
  updateAffiliateStatus(@Param('id') id: string, @Body('status') status: 'ACTIVE' | 'INACTIVE') {
    return this.contentService.updateAffiliateStatus(id, status);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('admin/articles/:id/social-posts')
  queueSocialPost(@Param('id') id: string, @Body() dto: QueueSocialPostDto, @CurrentUser('id') userId: string) {
    return this.contentService.queueSocialPost(id, dto, userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/social-posts')
  listSocialPosts() {
    return this.contentService.listSocialPosts();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('admin/social-posts/:id/retry')
  retrySocialPost(@Param('id') id: string) {
    return this.contentService.retrySocialPost(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('admin/social-metrics')
  createSocialMetric(@Body() dto: CreateSocialMetricDto) {
    return this.contentService.createSocialMetric(dto);
  }

  @Get('articles')
  listPublicArticles() {
    return this.contentService.listPublicArticles();
  }

  @Get('articles/:slug')
  findPublicArticle(@Param('slug') slug: string) {
    return this.contentService.findPublicArticle(slug);
  }

  @Get('r/:trackingCode')
  async redirect(@Param('trackingCode') trackingCode: string, @Req() request: Request, @Res() response: Response) {
    const destinationUrl = await this.contentService.trackRedirect(trackingCode, request);
    response.redirect(destinationUrl);
  }
}
