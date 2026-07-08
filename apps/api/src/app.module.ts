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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
