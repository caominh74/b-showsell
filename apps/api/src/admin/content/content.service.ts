import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createHash } from 'crypto';
import type { Request } from 'express';
import { toSlug } from '../../common/slug';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAffiliateLinkDto } from './dto/create-affiliate-link.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { CreateSocialMetricDto } from './dto/create-social-metric.dto';
import { QueueSocialPostDto } from './dto/queue-social-post.dto';
import { UpdateAffiliateLinkDto } from './dto/update-affiliate-link.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

const articleInclude = {
  brand: true,
  campaign: true,
  author: { select: { id: true, fullName: true, email: true } },
  affiliateLinks: { include: { brand: true, product: true } },
  socialPosts: true,
} satisfies Prisma.ContentArticleInclude;

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  listArticles(status?: string) {
    return this.prisma.contentArticle.findMany({
      where: { status: status as never },
      include: articleInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async createArticle(dto: CreateArticleDto, authorId: string) {
    return this.prisma.contentArticle.create({
      data: this.toArticleCreateData(dto, authorId),
      include: articleInclude,
    });
  }

  async findArticle(id: string) {
    const article = await this.prisma.contentArticle.findUnique({ where: { id }, include: articleInclude });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async updateArticle(id: string, dto: UpdateArticleDto) {
    await this.findArticle(id);
    return this.prisma.contentArticle.update({
      where: { id },
      data: this.toArticleUpdateData(dto),
      include: articleInclude,
    });
  }

  async publishArticle(id: string) {
    const article = await this.findArticle(id);
    const published = await this.prisma.contentArticle.update({
      where: { id },
      data: { status: 'PUBLISHED', publishedAt: new Date() },
      include: articleInclude,
    });

    if (article.campaign?.advertisingFee && article.campaign.advertisingFee > 0) {
      await this.prisma.revenueRecord.create({
        data: {
          sourceType: 'ADVERTISING',
          campaignId: article.campaignId,
          brandId: article.brandId ?? article.campaign.brandId,
          amount: article.campaign.advertisingFee,
          profitAmount: article.campaign.advertisingFee,
          notes: `Advertising fee recognized when article "${article.title}" was published.`,
        },
      });
    }

    return published;
  }

  async archiveArticle(id: string) {
    await this.findArticle(id);
    return this.prisma.contentArticle.update({
      where: { id },
      data: { status: 'ARCHIVED' },
      include: articleInclude,
    });
  }

  listPublicArticles() {
    return this.prisma.contentArticle.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        brand: true,
        campaign: true,
        affiliateLinks: { where: { status: 'ACTIVE' }, include: { product: { include: { images: true } } } },
      },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findPublicArticle(slug: string) {
    const article = await this.prisma.contentArticle.findFirst({
      where: { slug, status: 'PUBLISHED' },
      include: {
        brand: true,
        campaign: true,
        affiliateLinks: { where: { status: 'ACTIVE' }, include: { brand: true, product: { include: { images: true } } } },
      },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  listAffiliateLinks() {
    return this.prisma.affiliateLink.findMany({
      include: { brand: true, campaign: true, product: true, article: true, _count: { select: { clicks: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  createAffiliateLink(dto: CreateAffiliateLinkDto) {
    return this.prisma.affiliateLink.create({
      data: {
        ...dto,
        trackingCode: dto.trackingCode || toSlug(`${dto.label}-${Date.now()}`),
        channel: dto.channel ?? 'OTHER',
        status: dto.status ?? 'ACTIVE',
      },
      include: { brand: true, campaign: true, product: true, article: true },
    });
  }

  async updateAffiliateLink(id: string, dto: UpdateAffiliateLinkDto) {
    await this.findAffiliateLink(id);
    return this.prisma.affiliateLink.update({
      where: { id },
      data: dto,
      include: { brand: true, campaign: true, product: true, article: true },
    });
  }

  async updateAffiliateStatus(id: string, status: 'ACTIVE' | 'INACTIVE') {
    await this.findAffiliateLink(id);
    return this.prisma.affiliateLink.update({ where: { id }, data: { status } });
  }

  async trackRedirect(trackingCode: string, request: Request, customerId?: string) {
    const link = await this.prisma.affiliateLink.findUnique({
      where: { trackingCode },
      include: { brand: true },
    });
    if (!link || link.status !== 'ACTIVE') {
      throw new NotFoundException('Affiliate link not found');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.affiliateClick.create({
        data: {
          affiliateLinkId: link.id,
          customerId,
          sessionId: String(request.headers['x-session-id'] ?? ''),
          ipHash: this.hashIp(request.ip),
          userAgent: request.headers['user-agent'],
          referrer: request.headers.referer,
        },
      });
      await tx.affiliateLink.update({ where: { id: link.id }, data: { clickCount: { increment: 1 } } });

      const commission = link.commissionRate ?? link.brand.defaultCommissionRate;
      if (commission > 0) {
        await tx.revenueRecord.create({
          data: {
            sourceType: 'AFFILIATE',
            campaignId: link.campaignId,
            brandId: link.brandId,
            amount: commission,
            profitAmount: commission,
            notes: `Affiliate click tracked for ${link.label}.`,
          },
        });
      }
    });

    return link.destinationUrl;
  }

  queueSocialPost(articleId: string, dto: QueueSocialPostDto, createdById: string) {
    return this.prisma.socialPost.create({
      data: {
        articleId,
        campaignId: dto.campaignId,
        platform: dto.platform,
        status: 'QUEUED',
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
        createdById,
      },
      include: { campaign: true, article: true, createdBy: { select: { id: true, fullName: true } } },
    });
  }

  listSocialPosts() {
    return this.prisma.socialPost.findMany({
      include: { campaign: true, article: true, createdBy: { select: { id: true, fullName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async retrySocialPost(id: string) {
    const post = await this.prisma.socialPost.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Social post not found');
    }
    return this.prisma.socialPost.update({
      where: { id },
      data: { status: 'QUEUED', errorMessage: null },
    });
  }

  createSocialMetric(dto: CreateSocialMetricDto) {
    const impressions = dto.impressions ?? 0;
    const clicks = dto.clicks ?? 0;
    return this.prisma.socialMetric.create({
      data: {
        campaignId: dto.campaignId,
        socialPostId: dto.socialPostId,
        platform: dto.platform,
        metricDate: dto.metricDate ? new Date(dto.metricDate) : undefined,
        reach: dto.reach ?? 0,
        impressions,
        likes: dto.likes ?? 0,
        comments: dto.comments ?? 0,
        shares: dto.shares ?? 0,
        clicks,
        ctr: impressions > 0 ? clicks / impressions : 0,
        source: dto.source ?? 'MANUAL',
      },
    });
  }

  private async findAffiliateLink(id: string) {
    const link = await this.prisma.affiliateLink.findUnique({ where: { id } });
    if (!link) {
      throw new NotFoundException('Affiliate link not found');
    }
    return link;
  }

  private toArticleCreateData(dto: CreateArticleDto, authorId: string): Prisma.ContentArticleUncheckedCreateInput {
    if (dto.status === 'PUBLISHED' && dto.scheduledAt) {
      throw new BadRequestException('Published articles cannot also be scheduled');
    }
    return {
      campaignId: dto.campaignId,
      brandId: dto.brandId,
      title: dto.title,
      slug: dto.slug || toSlug(dto.title),
      excerpt: dto.excerpt,
      bodyMarkdown: dto.bodyMarkdown,
      coverImageUrl: dto.coverImageUrl,
      status: dto.status ?? 'DRAFT',
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      publishedAt: dto.status === 'PUBLISHED' ? new Date() : undefined,
      authorId,
    };
  }

  private toArticleUpdateData(dto: UpdateArticleDto): Prisma.ContentArticleUncheckedUpdateInput {
    return {
      campaignId: dto.campaignId,
      brandId: dto.brandId,
      title: dto.title,
      slug: dto.slug,
      excerpt: dto.excerpt,
      bodyMarkdown: dto.bodyMarkdown,
      coverImageUrl: dto.coverImageUrl,
      status: dto.status,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
    };
  }

  private hashIp(ip?: string) {
    if (!ip) {
      return undefined;
    }
    return createHash('sha256').update(ip).digest('hex');
  }
}
