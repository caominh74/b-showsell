import { ApiProperty } from '@nestjs/swagger';
import { MetricSource, SocialPlatform } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateSocialMetricDto {
  @ApiProperty()
  @IsString()
  campaignId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  socialPostId?: string;

  @ApiProperty({ enum: SocialPlatform })
  @IsEnum(SocialPlatform)
  platform: SocialPlatform;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  metricDate?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  reach?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  impressions?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  likes?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  comments?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  shares?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  clicks?: number;

  @ApiProperty({ enum: MetricSource, required: false })
  @IsEnum(MetricSource)
  @IsOptional()
  source?: MetricSource;
}
