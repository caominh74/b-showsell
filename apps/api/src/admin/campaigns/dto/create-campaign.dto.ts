import { ApiProperty } from '@nestjs/swagger';
import { CampaignStatus, CollaborationType } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCampaignDto {
  @ApiProperty()
  @IsString()
  brandId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: CollaborationType })
  @IsEnum(CollaborationType)
  collaborationType: CollaborationType;

  @ApiProperty({ enum: CampaignStatus, required: false })
  @IsEnum(CampaignStatus)
  @IsOptional()
  status?: CampaignStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  advertisingFee?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  expectedCommissionRate?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  actualAffiliateCommission?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
