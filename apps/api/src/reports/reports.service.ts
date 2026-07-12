import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async revenue(from?: string, to?: string, sourceType?: string) {
    const where = {
      sourceType: sourceType as never,
      occurredAt: this.dateRange(from, to),
    };
    const [records, totals] = await Promise.all([
      this.prisma.revenueRecord.findMany({ where, orderBy: { occurredAt: 'desc' } }),
      this.prisma.revenueRecord.groupBy({
        by: ['sourceType'],
        where,
        _sum: { amount: true, costAmount: true, profitAmount: true },
      }),
    ]);
    return {
      records,
      totals,
      grandTotal: records.reduce((sum, record) => sum + record.amount, 0),
      grandProfit: records.reduce((sum, record) => sum + record.profitAmount, 0),
    };
  }

  async campaigns() {
    const campaigns = await this.prisma.campaign.findMany({
      include: {
        brand: true,
        socialMetrics: true,
        affiliateLinks: true,
        socialPosts: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return campaigns.map((campaign) => {
      const metrics = campaign.socialMetrics;
      const impressions = metrics.reduce((sum, metric) => sum + metric.impressions, 0);
      const clicks = metrics.reduce((sum, metric) => sum + metric.clicks, 0);
      return {
        id: campaign.id,
        name: campaign.name,
        brand: campaign.brand.name,
        status: campaign.status,
        posts: campaign.socialPosts.length,
        affiliateLinks: campaign.affiliateLinks.length,
        reach: metrics.reduce((sum, metric) => sum + metric.reach, 0),
        impressions,
        likes: metrics.reduce((sum, metric) => sum + metric.likes, 0),
        comments: metrics.reduce((sum, metric) => sum + metric.comments, 0),
        shares: metrics.reduce((sum, metric) => sum + metric.shares, 0),
        clicks,
        ctr: impressions > 0 ? clicks / impressions : 0,
      };
    });
  }

  async affiliateLinks() {
    const links = await this.prisma.affiliateLink.findMany({
      include: {
        brand: true,
        campaign: true,
        product: true,
        article: true,
        clicks: true,
      },
      orderBy: { clickCount: 'desc' },
    });

    return links.map((link) => ({
      id: link.id,
      label: link.label,
      trackingCode: link.trackingCode,
      brand: link.brand.name,
      campaign: link.campaign?.name,
      product: link.product?.name,
      article: link.article?.title,
      channel: link.channel,
      status: link.status,
      clickCount: link.clickCount,
      uniqueSessions: new Set(link.clicks.map((click) => click.sessionId).filter(Boolean)).size,
    }));
  }

  async orders(from?: string, to?: string) {
    const where = { placedAt: this.dateRange(from, to) };
    const [byStatus, orders, bestSelling] = await Promise.all([
      this.prisma.order.groupBy({ by: ['status'], where, _count: { id: true }, _sum: { total: true } }),
      this.prisma.order.findMany({ where, include: { items: true }, orderBy: { placedAt: 'desc' } }),
      this.prisma.orderItem.groupBy({ by: ['productId', 'productNameSnapshot'], _sum: { quantity: true, lineTotal: true } }),
    ]);

    return {
      orderCount: orders.length,
      revenue: orders.reduce((sum, order) => sum + order.total, 0),
      byStatus,
      bestSelling: bestSelling
        .sort((a, b) => (b._sum.quantity ?? 0) - (a._sum.quantity ?? 0))
        .slice(0, 10),
    };
  }

  async toCsv(reportType: string, from?: string, to?: string) {
    if (reportType === 'revenue') {
      const report = await this.revenue(from, to);
      return this.csv(
        ['sourceType', 'amount', 'costAmount', 'profitAmount', 'occurredAt', 'notes'],
        report.records.map((record) => [
          record.sourceType,
          record.amount,
          record.costAmount,
          record.profitAmount,
          record.occurredAt.toISOString(),
          record.notes ?? '',
        ]),
      );
    }

    if (reportType === 'affiliate-links') {
      const rows = await this.affiliateLinks();
      return this.csv(
        ['label', 'trackingCode', 'brand', 'campaign', 'channel', 'status', 'clickCount', 'uniqueSessions'],
        rows.map((row) => [
          row.label,
          row.trackingCode,
          row.brand,
          row.campaign ?? '',
          row.channel,
          row.status,
          row.clickCount,
          row.uniqueSessions,
        ]),
      );
    }

    const report = await this.orders(from, to);
    return this.csv(
      ['metric', 'value'],
      [
        ['orderCount', report.orderCount],
        ['revenue', report.revenue],
      ],
    );
  }

  private dateRange(from?: string, to?: string) {
    if (!from && !to) {
      return undefined;
    }
    return {
      gte: from ? new Date(from) : undefined,
      lte: to ? new Date(to) : undefined,
    };
  }

  private csv(headers: string[], rows: (string | number)[][]) {
    return [headers, ...rows]
      .map((row) =>
        row
          .map((value) => String(value).replace(/"/g, '""'))
          .map((value) => `"${value}"`)
          .join(','),
      )
      .join('\n');
  }
}
