import { ApiProperty } from '@nestjs/swagger';
import { AffiliateLinkStatus, Channel } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateAffiliateLinkDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  campaignId?: string;

  @ApiProperty()
  @IsString()
  brandId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  articleId?: string;

  @ApiProperty()
  @IsString()
  label: string;

  @ApiProperty()
  @IsUrl()
  destinationUrl: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  trackingCode?: string;

  @ApiProperty({ enum: Channel, required: false })
  @IsEnum(Channel)
  @IsOptional()
  channel?: Channel;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  commissionRate?: number;

  @ApiProperty({ enum: AffiliateLinkStatus, required: false })
  @IsEnum(AffiliateLinkStatus)
  @IsOptional()
  status?: AffiliateLinkStatus;
}
