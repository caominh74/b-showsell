import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CheckoutDto {
  @ApiProperty()
  @IsString()
  recipientName: string;

  @ApiProperty()
  @IsString()
  recipientPhone: string;

  @ApiProperty()
  @IsString()
  shippingAddressLine1: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  shippingAddressLine2?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ward?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ enum: PaymentStatus, required: false, default: PaymentStatus.MOCK_PAID })
  @IsEnum(PaymentStatus)
  @IsOptional()
  mockPaymentStatus?: PaymentStatus;
}
