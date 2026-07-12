import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AdminUsersModule } from './admin/users/admin-users.module';
import { BrandsModule } from './admin/brands/brands.module';
import { CampaignsModule } from './admin/campaigns/campaigns.module';
import { ProductsModule } from './staff/products/products.module';
import { OrdersModule } from './staff/orders/orders.module';
import { CatalogModule } from './catalog/catalog.module';
import { CommerceModule } from './customer/commerce/commerce.module';
import { ContentModule } from './admin/content/content.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ReportsModule } from './reports/reports.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AdminUsersModule,
    BrandsModule,
    CampaignsModule,
    ProductsModule,
    OrdersModule,
    CatalogModule,
    CommerceModule,
    ContentModule,
    ReviewsModule,
    ReportsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
