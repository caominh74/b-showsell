import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CreateGlobalMilestoneDto } from './dto/create-global-milestone.dto';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@ApiTags('admin campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get('campaigns')
  list(@Query('status') status?: string, @Query('brandId') brandId?: string) {
    return this.campaignsService.list(status, brandId);
  }

  @Post('campaigns')
  create(@Body() dto: CreateCampaignDto, @CurrentUser('id') userId: string) {
    return this.campaignsService.create(dto, userId);
  }

  @Get('campaigns/:id')
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }

  @Patch('campaigns/:id')
  update(@Param('id') id: string, @Body() dto: UpdateCampaignDto) {
    return this.campaignsService.update(id, dto);
  }

  @Get('campaigns/:id/milestones')
  listMilestones(@Param('id') id: string) {
    return this.campaignsService.listMilestones(id);
  }

  @Get('milestones')
  listAllMilestones() {
    return this.campaignsService.listAllMilestones();
  }

  @Post('milestones')
  createGlobalMilestone(@Body() dto: CreateGlobalMilestoneDto) {
    return this.campaignsService.createMilestone(dto.campaignId, dto);
  }

  @Post('campaigns/:id/milestones')
  createMilestone(@Param('id') id: string, @Body() dto: CreateMilestoneDto) {
    return this.campaignsService.createMilestone(id, dto);
  }

  @Patch('milestones/:id')
  updateMilestone(@Param('id') id: string, @Body() dto: UpdateMilestoneDto) {
    return this.campaignsService.updateMilestone(id, dto);
  }
}
