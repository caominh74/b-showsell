import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  list(status?: string, brandId?: string) {
    return this.prisma.campaign.findMany({
      where: {
        status: status as never,
        brandId,
      },
      include: {
        brand: true,
        createdBy: { select: { id: true, fullName: true, email: true } },
        _count: { select: { milestones: true, affiliateLinks: true, socialPosts: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateCampaignDto, createdById: string) {
    this.assertDates(dto.startDate, dto.endDate);
    return this.prisma.campaign.create({
      data: this.toCampaignCreateData(dto, createdById),
      include: { brand: true },
    });
  }

  async findOne(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        brand: true,
        createdBy: { select: { id: true, fullName: true, email: true } },
        milestones: { include: { assignedTo: { select: { id: true, fullName: true, email: true } } } },
      },
    });
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }
    return campaign;
  }

  async update(id: string, dto: UpdateCampaignDto) {
    await this.findOne(id);
    this.assertDates(dto.startDate, dto.endDate);
    return this.prisma.campaign.update({
      where: { id },
      data: this.toCampaignUpdateData(dto),
      include: { brand: true },
    });
  }

  listMilestones(campaignId: string) {
    return this.prisma.campaignMilestone.findMany({
      where: { campaignId },
      include: { assignedTo: { select: { id: true, fullName: true, email: true } } },
      orderBy: { dueAt: 'asc' },
    });
  }

  listAllMilestones() {
    return this.prisma.campaignMilestone.findMany({
      include: {
        campaign: { include: { brand: true } },
        assignedTo: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: { dueAt: 'asc' },
    });
  }

  async createMilestone(campaignId: string, dto: CreateMilestoneDto) {
    await this.findOne(campaignId);
    const milestone = await this.prisma.campaignMilestone.create({
      data: this.toMilestoneCreateData(dto, campaignId),
    });
    await this.queueReminder(milestone.id, milestone.title, milestone.assignedToId, milestone.reminderAt);
    return milestone;
  }

  async updateMilestone(id: string, dto: UpdateMilestoneDto) {
    const existing = await this.prisma.campaignMilestone.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Milestone not found');
    }
    const milestone = await this.prisma.campaignMilestone.update({
      where: { id },
      data: this.toMilestoneUpdateData(dto),
    });
    await this.queueReminder(milestone.id, milestone.title, milestone.assignedToId, milestone.reminderAt);
    return milestone;
  }

  private assertDates(startDate?: string, endDate?: string) {
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      throw new BadRequestException('Campaign endDate cannot be before startDate');
    }
  }

  private toCampaignCreateData(dto: CreateCampaignDto, createdById: string): Prisma.CampaignUncheckedCreateInput {
    return {
      brandId: dto.brandId,
      name: dto.name,
      description: dto.description,
      collaborationType: dto.collaborationType,
      status: dto.status ?? 'DRAFT',
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      advertisingFee: dto.advertisingFee,
      expectedCommissionRate: dto.expectedCommissionRate,
      actualAffiliateCommission: dto.actualAffiliateCommission,
      notes: dto.notes,
      createdById,
    };
  }

  private toCampaignUpdateData(dto: UpdateCampaignDto): Prisma.CampaignUncheckedUpdateInput {
    return {
      brandId: dto.brandId,
      name: dto.name,
      description: dto.description,
      collaborationType: dto.collaborationType,
      status: dto.status,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      advertisingFee: dto.advertisingFee,
      expectedCommissionRate: dto.expectedCommissionRate,
      actualAffiliateCommission: dto.actualAffiliateCommission,
      notes: dto.notes,
    };
  }

  private toMilestoneCreateData(dto: CreateMilestoneDto, campaignId: string): Prisma.CampaignMilestoneUncheckedCreateInput {
    return {
      campaignId,
      title: dto.title,
      description: dto.description,
      dueAt: new Date(dto.dueAt),
      reminderAt: dto.reminderAt ? new Date(dto.reminderAt) : undefined,
      status: dto.status,
      assignedToId: dto.assignedToId,
    };
  }

  private toMilestoneUpdateData(dto: UpdateMilestoneDto): Prisma.CampaignMilestoneUncheckedUpdateInput {
    return {
      title: dto.title,
      description: dto.description,
      dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined,
      reminderAt: dto.reminderAt ? new Date(dto.reminderAt) : undefined,
      status: dto.status,
      assignedToId: dto.assignedToId,
    };
  }

  private async queueReminder(milestoneId: string, title: string, userId: string | null, reminderAt: Date | null) {
    if (!reminderAt) {
      return;
    }

    await this.prisma.notificationLog.create({
      data: {
        userId,
        type: 'REMINDER',
        channel: 'IN_APP',
        subject: `Campaign milestone: ${title}`,
        body: `Reminder queued for milestone ${milestoneId}.`,
        status: 'QUEUED',
        scheduledAt: reminderAt,
      },
    });
  }
}
