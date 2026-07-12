import { Controller, Get, Header, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Roles(Role.ADMIN)
  @Get('admin/reports/revenue')
  revenue(@Query('from') from?: string, @Query('to') to?: string, @Query('sourceType') sourceType?: string) {
    return this.reportsService.revenue(from, to, sourceType);
  }

  @Roles(Role.ADMIN)
  @Get('admin/reports/campaigns')
  campaigns() {
    return this.reportsService.campaigns();
  }

  @Roles(Role.ADMIN)
  @Get('admin/reports/affiliate-links')
  affiliateLinks() {
    return this.reportsService.affiliateLinks();
  }

  @Roles(Role.ADMIN)
  @Get('admin/reports/orders')
  adminOrders(@Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.orders(from, to);
  }

  @Roles(Role.STAFF)
  @Get('staff/reports/orders')
  staffOrders(@Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.orders(from, to);
  }

  @Roles(Role.ADMIN, Role.STAFF)
  @Get('reports/:reportType/export.csv')
  @Header('Content-Type', 'text/csv')
  exportCsv(@Param('reportType') reportType: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.toCsv(reportType, from, to);
  }
}
